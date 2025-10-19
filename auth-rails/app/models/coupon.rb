class Coupon < ApplicationRecord
  validates :code, presence: true, uniqueness: true
  validates :duration, presence: true
  validates :percent_off, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :amount_off, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  before_create :create_stripe_coupon_and_promo
  before_update :update_stripe_coupon_and_promo
  before_destroy :delete_stripe_coupon

  private

  # ✅ CREATE on Stripe
  def create_stripe_coupon_and_promo
    stripe_coupon = Stripe::Coupon.create(
      percent_off: percent_off,
      amount_off: amount_off&.to_i,
      currency: 'usd',
      duration: duration
    )


    self.stripe_coupon_id = stripe_coupon.id

    promo = Stripe::PromotionCode.create(
      coupon: stripe_coupon.id,
      code: code,
      active: active
    )

    # Optionally store promo code ID if you want
    self.stripe_promotion_code_id = promo.id if self.respond_to?(:stripe_promotion_code_id)
  rescue Stripe::StripeError => e
    errors.add(:base, "Stripe error: #{e.message}")
    throw :abort
  end

  # ✅ UPDATE on Stripe
  def update_stripe_coupon_and_promo
    # Only try to update if it exists on Stripe
    return unless stripe_coupon_id.present?

    # Step 1️⃣ Update the coupon if discount values changed
    if saved_change_to_percent_off? || saved_change_to_amount_off?
      Stripe::Coupon.update(
        stripe_coupon_id,
        {
          percent_off: percent_off,
          amount_off: amount_off&.to_i,
          currency: 'usd',
          duration: duration
        }.compact
      )
    end

    # Step 2️⃣ Update promotion code if code or active changed
    if saved_change_to_code? || saved_change_to_active?
      # Find promotion code linked to this coupon (by code or saved ID)
      promo_code =
        if respond_to?(:stripe_promotion_code_id) && stripe_promotion_code_id.present?
          Stripe::PromotionCode.retrieve(stripe_promotion_code_id)
        else
          Stripe::PromotionCode.list(limit: 1, code: code).data.first
        end

      if promo_code.present?
        Stripe::PromotionCode.update(
          promo_code.id,
          {
            active: active,
            code: code
          }.compact
        )
      end
    end
  rescue Stripe::StripeError => e
    errors.add(:base, "Stripe error: #{e.message}")
    throw :abort
  end

  # ✅ DELETE on Stripe
  def delete_stripe_coupon
    Stripe::Coupon.delete(stripe_coupon_id) if stripe_coupon_id.present?
  rescue Stripe::StripeError => e
    Rails.logger.error("Failed to delete Stripe coupon: #{e.message}")
  end
end
