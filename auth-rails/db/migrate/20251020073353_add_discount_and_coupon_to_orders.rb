class AddDiscountAndCouponToOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :discount_amount, :decimal, precision: 10, scale: 2, default: 0.0
    add_reference :orders, :coupon, foreign_key: true, null: true
  end
end
