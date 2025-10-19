class Api::V1::CouponsController < ApplicationController
  before_action :set_coupon, only: %i[show update destroy]

  # GET /coupons
  def index
    @coupons = Coupon.all
    render json: @coupons
  end

  # GET /coupons/1
  def show
    render json: @coupon
  end

  # POST /coupons
  def create
    @coupon = Coupon.new(coupon_params)

    begin
      # Create the coupon on Stripe first
      stripe_coupon = Stripe::Coupon.create(stripe_coupon_params)

      # Assign the returned Stripe ID and status to our local object
      @coupon.stripe_coupon_id = stripe_coupon.id
      @coupon.active = stripe_coupon.valid

      if @coupon.save
        render json: @coupon, status: :created
      else
        # If our local save fails, delete the Stripe coupon to prevent orphans
        Stripe::Coupon.delete(stripe_coupon.id)
        render json: @coupon.errors, status: :unprocessable_entity
      end
    rescue Stripe::StripeError => e
      # If the Stripe API returns an error, render it
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /coupons/1
  def update
    begin
      # NOTE: Most coupon attributes are immutable on Stripe.
      # This API call is here to show how you would update metadata if needed.
      Stripe::Coupon.update(@coupon.stripe_coupon_id, {
        metadata: { last_updated_at: Time.current.to_i }
      })

      if @coupon.update(coupon_params)
        render json: @coupon
      else
        render json: @coupon.errors, status: :unprocessable_entity
      end
    rescue Stripe::StripeError => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  # DELETE /coupons/1
  def destroy
    begin
      # Delete the coupon on Stripe first
      Stripe::Coupon.delete(@coupon.stripe_coupon_id)

      # Then destroy the local record
      @coupon.destroy
      head :no_content
    rescue Stripe::StripeError => e
      render json: { error: "Error deleting coupon from Stripe: #{e.message}" }, status: :unprocessable_entity
    end
  end

  private

  def set_coupon
    # Find by the unique `code` instead of `id` for a more RESTful API
    @coupon = Coupon.find_by!(code: params[:id])
  end

  # Strong params for your local Coupon model
  def coupon_params
    params.permit(:code, :percent_off, :amount_off, :duration, :active)
  end

  # Prepare params specifically for the Stripe API
  def stripe_coupon_params
    p = {
      id: coupon_params[:code], # Use your unique code as the Stripe ID
      duration: coupon_params[:duration], # 'forever', 'once', or 'repeating'
    }

    if coupon_params[:percent_off].present?
      p[:percent_off] = coupon_params[:percent_off]
    elsif coupon_params[:amount_off].present?
      p[:amount_off] = (coupon_params[:amount_off].to_f * 100).to_i # Stripe expects cents
      p[:currency] = 'usd' # IMPORTANT: Set your currency
    end

    p
  end
end