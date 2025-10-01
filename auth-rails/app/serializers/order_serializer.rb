class OrderSerializer
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
      shipping_address: shipping_address_data,
      stripe_session_id: order.stripe_session_id
    }
  end

  private

  attr_reader :order

  def user_data
    user = order.user
    {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  end

  def shipping_address_data
    return nil unless order.shipping_address

    AddressSerializer.new(order.shipping_address).as_json
  end
end
