class Api::V1::CouponsController < ApplicationController
  before_action :doorkeeper_authorize!
  before_action :set_coupon, only: %i[show update destroy]

  # GET /coupons
  def index
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 5).to_i

    coupons = Coupon.page(page).per(per_page)
    render json: {
             status: {
               code: 200,
               message: 'fetch_coupons_successfully',
             },
             data:
               coupons.map { |coupons| CouponSerializer.new(coupons).as_json },
             pagination: {
               current_page: coupons.current_page,
               next_page: coupons.next_page,
               prev_page: coupons.prev_page,
               total_pages: coupons.total_pages,
               total_count: coupons.total_count,
             },
           },
           status: :ok
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
        render json: {
                 status: {
                   code: 201,
                   message: 'coupon_created_successfully',
                 },
                 data: CouponSerializer.new(@coupon).as_json,
               },
               status: :created
      else
        Stripe::Coupon.delete(stripe_coupon.id)

        render json: {
                 status: {
                   code: 422,
                   message: 'coupon_create_failed',
                 },
                 data: nil,
                 errors:
                   @coupon
                     .errors
                     .full_messages
                     .map do |msg|
                       {
                         code: 'VALIDATION_ERROR',
                         title: 'Unprocessable Entity',
                         detail: msg,
                       }
                     end,
               },
               status: :unprocessable_entity
      end
    rescue Stripe::StripeError => e
      # If the Stripe API returns an error, render it
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /coupons/1
  def update
    begin
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
      render json: {
               error: "Error deleting coupon from Stripe: #{e.message}",
             },
             status: :unprocessable_entity
    end
  end

  # GET /coupons/validate?code=YOUR_CODE
  def validate
    code = params[:code]
    unless code.present?
      return(
        render json: {
                 status: {
                   code: 400,
                   message: 'Bad Request',
                 },
                 data: {
                   error: 'Coupon code parameter is missing',
                 },
               },
               status: :bad_request
      )
    end

    coupon = Coupon.find_by(code: code)

    # Check 1: Does the coupon exist in our database and is it active?
    unless coupon&.active?
      render json: {
               status: {
                 code: 200,
                 message: 'coupon_is_not_valid',
               },
               data: nil,
               errors:
                 coupon
                   .errors
                   .full_messages
                   .map do |msg|
                     {
                       code: 'VALIDATION_ERROR',
                       title: 'Unprocessable Entity',
                       detail: msg,
                     }
                   end,
             },
             status: :ok
    end

    # Check 2: Is the coupon still valid on Stripe?
    begin
      stripe_coupon = Stripe::Coupon.retrieve(coupon.stripe_coupon_id)
      if stripe_coupon.valid
        render json: {
                 status: {
                   code: 200,
                   message: 'coupon_is_valid',
                 },
                 data: CouponSerializer.new(coupon).as_json,
               },
               status: :ok
      else
        # If Stripe says it's invalid, update our local copy
        coupon.update(active: false)
        render json: {
                 status: {
                   code: 200,
                   message: 'Coupon is not valid',
                 },
                 data: {
                   valid: false,
                   reason: 'Coupon is no longer valid on Stripe.',
                 },
               },
               status: :ok
      end
    rescue Stripe::StripeError => e
      # This handles cases where the coupon was deleted directly on Stripe
      render json: {
               status: {
                 code: 200,
                 message: 'Coupon is not valid',
               },
               data: {
                 valid: false,
                 reason: "Stripe error: #{e.message}",
               },
             },
             status: :ok
    end
  end

  private

  def set_coupon
    # Find by the unique `code` instead of `id` for a more RESTful API
    @coupon = Coupon.find_by!(id: params[:id])
  end

  # Strong params for your local Coupon model
  def coupon_params
    params.permit(
      :code,
      :percent_off,
      :amount_off,
      :duration,
      :active,
      :duration_in_months,
    )
  end

  # Prepare params specifically for the Stripe API
  def stripe_coupon_params
    p = { id: coupon_params[:code], duration: coupon_params[:duration] }

    # Add duration_in_months ONLY if the duration is 'repeating'
    if coupon_params[:duration] == 'repeating' &&
         coupon_params[:duration_in_months].present?
      p[:duration_in_months] = coupon_params[:duration_in_months].to_i
    end

    if coupon_params[:percent_off].present?
      p[:percent_off] = coupon_params[:percent_off]
    elsif coupon_params[:amount_off].present?
      p[:amount_off] = (coupon_params[:amount_off].to_f * 100).to_i
      p[:currency] = 'usd'
    end

    p
  end
end
