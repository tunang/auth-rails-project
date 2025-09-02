class Api::V1::OrdersController < ApplicationController
  before_action :doorkeeper_authorize!, except: %i[index show] # ✅ Kiểm tra token trước mọi action
  before_action :set_order, only: %i[show update destroy]
  before_action :authorize_order, only: %i[show update destroy]

  def index
    @orders =
      current_user
        .orders
        .includes(:books, :user, :shipping_address)
        .page(params[:page] || 1)
        .per(params[:per_page] || 10)

    authorize @orders

    render json: {
             status: {
               code: 200,
               message: 'Fetched orders successfully',
             },
             data: @orders.map { |order| OrderSerializer.new(order).as_json },
             pagination: {
               current_page: @orders.current_page,
               next_page: @orders.next_page,
               prev_page: @orders.prev_page,
               total_pages: @orders.total_pages,
               total_count: @orders.total_count,
             },
           },
           status: :ok
  end

  def get_all
    orders =
      Order
        .includes(:books, :user, :shipping_address)
        .page(params[:page] || 1)
        .per(params[:per_page] || 5)

    authorize Order, :get_all?

    render json: {
             status: {
               code: 200,
               message: 'Fetched all orders successfully',
             },
             data: orders.map { |order| OrderSerializer.new(order).as_json },
             pagination: {
               current_page: orders.current_page,
               next_page: orders.next_page,
               prev_page: orders.prev_page,
               total_pages: orders.total_pages,
               total_count: orders.total_count,
             },
           },
           status: :ok
  end

  def show
    authorize @order

    render json: {
             status: {
               code: 200,
               message: 'Fetched order successfully',
             },
             data: OrderSerializer.new(@order).as_json,
           },
           status: :ok
  end

  def create
    ActiveRecord::Base.transaction do
      cart_items = current_user.cart_items.includes(:book)
      raise ActiveRecord::RecordNotFound, 'Cart is empty' if cart_items.empty?

      subtotal = cart_items.sum { |item| item.book.price * item.quantity }
      tax_amount = subtotal * 0.1
      shipping_cost = 5
      total_amount = subtotal + tax_amount + shipping_cost

      order =
        current_user.orders.create!(
          order_number: SecureRandom.hex(10).upcase,
          status: 0,
          subtotal: subtotal,
          tax_amount: tax_amount,
          shipping_cost: shipping_cost,
          total_amount: total_amount,
          shipping_address_id: order_params[:shipping_address_id],
          payment_method: order_params[:payment_method],
          payment_status: 'pending',
          tracking_number: nil,
          notes: order_params[:notes],
        )

      cart_items.each do |item|
        unit_price = item.book.price
        quantity = item.quantity
        total_price = unit_price * quantity

        OrderItem.create!(
          order: order,
          book: item.book,
          quantity: quantity,
          unit_price: unit_price,
          total_price: total_price,
        )
      end

      # Xóa giỏ hàng
      cart_items.destroy_all

      # Tạo line items cho Stripe
      line_items = StripeService.new.build_line_items_from_order(order)

      # Append tax as separate line item
      line_items << {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax (10%)',
          },
          unit_amount: (tax_amount * 100).to_i, # Stripe uses cents
        },
        quantity: 1,
      }

      # Append shipping as separate line item
      line_items << {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: (shipping_cost * 100).to_i, # $5 → 500 cents
        },
        quantity: 1,
      }

      # Tạo checkout session Stripe
      session =
        Stripe::Checkout::Session.create(
          payment_method_types: ['card'],
          line_items: line_items,
          mode: 'payment',
          success_url:
            "#{ENV['FRONTEND_URL']}/checkout/success?session_id={CHECKOUT_SESSION_ID}",
          cancel_url: "#{ENV['FRONTEND_URL']}/checkout/cancel",
        )

      order.update!(stripe_session_id: session.id)

      # Only current user
      # OrdersChannel.broadcast_to(
      #   current_user,
      #   {
      #     type: 'ORDER_UPDATED', # custom type
      #     payload: OrderSerializer.new(order).as_json,
      #   },
      # )

      # All admin
      ActionCable.server.broadcast(
        'admin_orders',
        { type: 'ORDER_UPDATED', payload: OrderSerializer.new(order).as_json },
      )

      render json: {
               status: {
                 code: 201,
                 message: 'Order created successfully',
               },
               data: OrderSerializer.new(order).as_json,
               payment_url: session.url,
             },
             status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: {
             error: e.record.errors.full_messages,
           },
           status: :unprocessable_entity
  rescue Stripe::StripeError => e
    render json: { error: e.message }, status: :unprocessable_entity
  rescue => e
    render json: { error: e.message }, status: :bad_request
  end

  def update
    authorize @order
    if @order.update(order_params)
      # OrdersChannel.broadcast_to(
      #   current_user,
      #   { type: 'ORDER_UPDATED', payload: OrderSerializer.new(@order).as_json },
      # )
      render json: {
               status: {
                 code: 201,
                 message: 'Order status updated successfully',
               },
               data: OrderSerializer.new(@order).as_json,
             },
             status: :created
    else
      render json: {
               errors: @order.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def destroy
    @order.destroy
    render json: {
             status: {
               code: 201,
               message: 'Order created successfully',
             },
             data: OrderSerializer.new(@order).as_json,
           },
           status: :created
  end

  private

  def set_order
    @order = Order.find(params[:id])
  end

  def authorize_order
    authorize @order
  end

  def order_params
    params.permit(:shipping_address_id, :payment_method, :note, :status)
  end
end
