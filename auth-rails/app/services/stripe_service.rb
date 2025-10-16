# app/services/stripe_service.rb
class StripeService
  class StripeError < StandardError
  end

  # -------- Class methods --------
  def self.create_product(book)
    new.create_product(book)
  end

  def self.create_price(book, stripe_product_id)
    new.create_price(book, stripe_product_id)
  end

  def self.update_product(book)
    new.update_product(book)
  end

  def self.update_price(temp_book, original_book = nil)
    new.update_price(temp_book, original_book)
  end

  def self.create_product_with_price(book)
    new.create_product_with_price(book)
  end

  def self.update_product_with_price(temp_book, original_book = nil)
    new.update_product_with_price(temp_book, original_book)
  end

  # -------- Instance methods --------
  def create_product(book)
    stripe_product = Stripe::Product.create(product_params(book))
    Rails
      .logger.info "Created Stripe product: #{stripe_product.id} for book: #{book.id}"
    return stripe_product
  rescue Stripe::StripeError => e
    Rails
      .logger.error "Failed to create Stripe product for book #{book.id}: #{e.message}"
    raise StripeError, "Failed to create product on Stripe: #{e.message}"
  end

  def create_price(book, stripe_product_id)
    binding.pry
    stripe_price = Stripe::Price.create(price_params(book, stripe_product_id))
    Rails
      .logger.info "Created Stripe price: #{stripe_price.id} for book: #{book.id}"
    stripe_price
  rescue Stripe::StripeError => e
    Rails
      .logger.error "Failed to create Stripe price for book #{book.id}: #{e.message}"
    raise StripeError, "Failed to create price on Stripe: #{e.message}"
  end

  def create_product_with_price(book)
    stripe_product = create_product(book)
    stripe_price = create_price(book, stripe_product.id)
    { product: stripe_product, price: stripe_price }
  end

  def update_product_with_price(temp_book, original_book = nil)
    unless temp_book.stripe_product_id.present? &&
             temp_book.stripe_price_id.present?
      return
    end

    # 1️⃣ Update product name & description on Stripe
    stripe_product =
      Stripe::Product.update(
        temp_book.stripe_product_id,
        product_params(temp_book),
      )

    # 2️⃣ Create a new price (Stripe doesn’t allow price updates directly)
    new_price =
      Stripe::Price.create(
        product: temp_book.stripe_product_id,
        unit_amount: (temp_book.price * 100).to_i, # cents
        currency: 'usd',
      )

    # 3️⃣ Deactivate old price
    Stripe::Price.update(temp_book.stripe_price_id, { active: false })

    # 4️⃣ Update local DB record (only if original_book provided)
    if original_book.present?
      original_book.update!(stripe_price_id: new_price.id, sync_status: :synced)
    end

    Rails
      .logger.info "✅ Updated Stripe product & price for book #{original_book&.id || temp_book.id}"

    { product: stripe_product, price: new_price }
  rescue Stripe::StripeError => e
    Rails
      .logger.error "❌ Failed to update product & price for book #{temp_book.id}: #{e.message}"
    raise StripeError,
          "Failed to update product & price on Stripe: #{e.message}"
  end

  def update_product(book)
    return unless book.stripe_product_id.present?
    stripe_product =
      Stripe::Product.update(book.stripe_product_id, product_params(book))
    Rails
      .logger.info "Updated Stripe product: #{stripe_product.id} for book: #{book.id}"
    stripe_product
  rescue Stripe::StripeError => e
    Rails
      .logger.error "Failed to update Stripe product for book #{book.id}: #{e.message}"
    raise StripeError, "Failed to update product on Stripe: #{e.message}"
  end

  def update_price(temp_book, original_book = nil)
    return unless temp_book.stripe_price_id.present?

    # 1️⃣ Create a new price on Stripe
    new_price =
      Stripe::Price.create(
        product: temp_book.stripe_product_id,
        unit_amount: (temp_book.price * 100).to_i, # cents
        currency: 'usd',
      )

    # 2️⃣ Deactivate the old price
    Stripe::Price.update(temp_book.stripe_price_id, { active: false })

    # 3️⃣ Update only the original book in DB
    if original_book.present?
      original_book.update!(stripe_price_id: new_price.id)
    else
      Rails.logger.warn '⚠️ No original book provided — skipping DB update'
    end

    Rails
      .logger.info "✅ Updated Stripe price: #{new_price.id} for book #{original_book&.id || temp_book.id}"

    new_price
  rescue Stripe::StripeError => e
    Rails
      .logger.error "❌ Failed to update Stripe price for book #{temp_book.id}: #{e.message}"
    raise StripeError, "Failed to update price on Stripe: #{e.message}"
  end

  def delete_product(book)
    return unless book.stripe_product_id.present?
    stripe_product = Stripe::Product.delete(book.stripe_product_id)
    Rails
      .logger.info "Delete Stripe product: #{stripe_product.id} for book: #{book.id}"
    stripe_product
  rescue Stripe::StripeError => e
    Rails
      .logger.error "Failed to delete Stripe product for book #{book.id}: #{e.message}"
    raise StripeError, "Failed to delete product on Stripe: #{e.message}"
  end

  def build_line_items_from_order(order)
    order.order_items.map do |item|
      book = item.book
      if book.stripe_price_id.present?
        { price: book.stripe_price_id, quantity: item.quantity }
      else
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: book.title,
              description: "#{book.title} by #{book.authors[0].name}",
              # images:
              # if extract_cover_image_url(book)
              #   [extract_cover_image_url(book)]
              # else
              #   []
              # end,
            },
            unit_amount: calculate_price_in_cents(book),
          },
          quantity: item.quantity,
        }
      end
    end
  end

  private

  def product_params(book)
    { name: book.title, description: "#{book.title} title" }
  end

  def price_params(book, stripe_product_id)
    {
      unit_amount: calculate_price_in_cents(book),
      currency: 'usd',
      product: stripe_product_id,
    }
  end

  def calculate_price_in_cents(book)
    # Bước 1: Tính giá cuối cùng sau khi đã áp dụng giảm giá
    # Chú ý: dùng 100.0 để đảm bảo phép chia là số thực, tránh lỗi chia số nguyên
    final_price = book.price * (1 - book.discount_percentage / 100.0)

    # Bước 2: Chuyển giá cuối cùng sang đơn vị cent và làm tròn thành số nguyên
    (final_price * 100).to_i
  end

  def extract_cover_image_url(book)
    # Ví dụ: book.cover_image.attached? ? url_for(book.cover_image) : nil
    book.cover_image
  end
end
