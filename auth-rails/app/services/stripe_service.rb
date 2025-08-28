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

  def self.create_product_with_price(book)
    new.create_product_with_price(book)
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


  def delete_product(book)
    return unless book.stripe_product_id.present?
    stripe_product =
      Stripe::Product.delete(book.stripe_product_id)
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
              description: "#{book.title} by #{book.author}",
              images:
                if extract_cover_image_url(book)
                  [extract_cover_image_url(book)]
                else
                  []
                end,
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
    {
      name: book.title,
      description: "#{book.title} title",
    }
  end

  def price_params(book, stripe_product_id)
    {
      unit_amount: calculate_price_in_cents(book),
      currency: 'usd',
      product: stripe_product_id,
    }
  end

  def calculate_price_in_cents(book)
    (book.price * 100).to_i
  end

  def extract_cover_image_url(book)
    # Ví dụ: book.cover_image.attached? ? url_for(book.cover_image) : nil
    book.cover_image
  end
end
