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
      discount_amount: order.discount_amount,
      tax_amount: order.tax_amount,
      shipping_cost: order.shipping_cost,
      total_amount: order.total_amount,
      created_at: order.created_at,
      updated_at: order.updated_at,
      stripe_session_id: order.stripe_session_id,
      user: user_data,
      shipping_address: shipping_address_data,
      coupon: coupon_data, # ✅ new field
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

  def coupon_data
    return nil unless order.coupon

    {
      id: order.coupon.id,
      code: order.coupon.code,
      percent_off: order.coupon.percent_off,
      amount_off: order.coupon.amount_off,
      active: order.coupon.active,
    }
  end
end
