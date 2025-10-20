class DetailOrderSerializer
  def initialize(order)
    @order = order
  end

  def as_json(*)
    {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      subtotal: order.subtotal,
      tax_amount: order.tax_amount,
      shipping_cost: order.shipping_cost,
      total_amount: order.total_amount,
      created_at: order.created_at,
      updated_at: order.updated_at,
      user: user_data,
      order_items: order_items,
      shipping_address: shipping_address_data,
      stripe_session_id: order.stripe_session_id,
    }
  end

  private

  attr_reader :order

  def user_data
    user = order.user
    { id: user.id, name: user.name, email: user.email }
  end

  def order_items
    order.order_items.map do |order_item|
      {
        id: order_item.id,
        quantity: order_item.quantity,
        unit_price: order_item.unit_price,
        total_price: order_item.total_price,
      discount_amount: order.discount_amount,

        book: {
          id: order_item.book.id,
          title: order_item.book.title,
          price: order_item.book.price,
          cover_image_url: cover_image_url(order_item.book),
          slug: order_item.book.slug,
        },
      }
    end
  end

  private

  def cover_image_url(book)
    return unless book.cover_image.attached?
    Rails.application.routes.url_helpers.rails_blob_url(
      book.cover_image,
      only_path: true,
    )
  end
  def shipping_address_data
    return nil unless order.shipping_address

    AddressSerializer.new(order.shipping_address).as_json
  end
end
