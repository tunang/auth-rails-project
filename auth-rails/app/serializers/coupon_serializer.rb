# app/serializers/category_serializer.rb
class CouponSerializer
  def initialize(coupon)
    @coupon = coupon
  end

  def as_json(*)
    {
      id: @coupon.id,
      stripe_coupon_id: @coupon.stripe_coupon_id,
      code: @coupon.code,
      percent_off: @coupon.percent_off,
      amount_off: @coupon.amount_off,
      duration: @coupon.duration,
      active: @coupon.active,
      duration_in_months: @coupon.duration_in_months,
      created_at: @coupon.created_at,
      updated_at: @coupon.updated_at,
    }
  end
end
