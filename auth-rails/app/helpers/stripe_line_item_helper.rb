module StripeLineItemHelper
  def build_line_item(name:, unit_amount:)
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: name,
        },
        unit_amount: (unit_amount * 100).to_i, # Stripe uses cents
      },
      quantity: 1,
    }
  end
end
