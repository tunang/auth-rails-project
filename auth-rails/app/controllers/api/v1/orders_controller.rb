class Api::V1::OrdersController < ApplicationController
  before_action :doorkeeper_authorize!, except: %i[index show] # ✅ Kiểm tra token trước mọi action
  before_action :set_order, only: %i[show update destroy]
  before_action :authorize_order, only: %i[show update destroy]

  include StripeLineItemHelper
  include CartItemRemoval

  def index
    # authorize @orders

    @orders =
      current_user
        .orders
        .includes(:books, :user, :shipping_address)
        .page(params[:page] || 1)
        .per(params[:per_page] || 10)

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
    authorize Order, :get_all?

    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 5).to_i

    if filter_params.except(:page, :per_page).present?
      search_results =
        Order
          .search_orders(
            query: params[:query] || params[:search],
            sort_by: params[:sort_by],
            status: params[:status],
          )
          .page(page)
          .per(per_page)

      orders = search_results.records
    else
      # 📚 Fall back to DB if no filters/search applied
      search_results = Order.page(page).per(per_page)

      orders = search_results
    end

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

  def get_orders_of_user
  authorize Order, :get_orders_of_user?

  user = User.find(params[:id])

  page = (params[:page] || 1).to_i
  per_page = (params[:per_page] || 10).to_i

  orders = user
              .orders
              .includes(:books, :shipping_address)
              .order(created_at: :desc)
              .page(page)
              .per(per_page)

  render json: {
           status: {
             code: 200,
             message: "Fetched orders for user ##{user.id} successfully",
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
             data: DetailOrderSerializer.new(@order).as_json,
           },
           status: :ok
  end

  def create
    cart_items = order_params[:order_items]

    ActiveRecord::Base.transaction do
      subtotal =
        cart_items.sum do |item|
          book = Book.find(item[:book_id])
          ((book.price - book.price * (book.discount_percentage / 100)) * item[:quantity].to_i)
        end

      tax_amount = subtotal * AppConstants::Order::TAX_RATE
      shipping_cost = AppConstants::Order::SHIPPING_COST
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
        book = Book.find(item[:book_id])
        quantity = item[:quantity].to_i

        if book.stock_quantity < quantity
          raise ActiveRecord::RecordInvalid.new(order),
                "Not enough stock for #{book.title}"
        end

        # ✅ Create order item
        OrderItem.create!(
          order: order,
          book: book,
          quantity: quantity,
          unit_price: book.price,
          total_price: book.price * quantity,
        )

        # ✅ Update book stock and sold count
        book.update!(
          stock_quantity: book.stock_quantity - quantity,
          sold_count: book.sold_count + quantity,
        )
      end

      # Tạo line items cho Stripe
      line_items = StripeService.new.build_line_items_from_order(order)

      # Append tax & shipping line items
      line_items << build_line_item(name: 'Tax (10%)', unit_amount: tax_amount)
      line_items <<
        build_line_item(name: 'Shipping', unit_amount: shipping_cost)

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

      CancelUnpaidOrderJob.set(wait: 30.minutes).perform_later(order.id)

      #Remove bought items in cart
      remove_items_from_cart(cart_items)

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
        { type: 'ORDER_CREATED', payload: OrderSerializer.new(order).as_json },
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

  # orders_controller.rb
  def pay
    order =
      current_user.orders.find_by(stripe_session_id: params[:stripe_session_id])

    unless order&.pending? && order.payment_status == 'pending'
      return(
        render json: {
                 status: {
                   code: 422,
                   message: 'order_cannot_be_paid',
                 },
                 errors: ['Order is not payable'],
               },
               status: :unprocessable_entity
      )
    end

    session = Stripe::Checkout::Session.retrieve(order.stripe_session_id)

    if session && session.status == 'open'
      render json: {
               status: {
                 code: 200,
                 message: 'payment_session_reused',
               },
               data: {
                 order: OrderSerializer.new(order).as_json,
                 payment_url: session.url,
               },
             },
             status: :ok
    else
      # Session expired -> create a new one
      new_session =
        Stripe::Checkout::Session.create(
          payment_method_types: ['card'],
          line_items: StripeService.new.build_line_items_from_order(order),
          mode: 'payment',
          success_url:
            "#{ENV['FRONTEND_URL']}/checkout/success?session_id={CHECKOUT_SESSION_ID}",
          cancel_url: "#{ENV['FRONTEND_URL']}/checkout/cancel",
        )

      order.update!(stripe_session_id: new_session.id)

      render json: {
               status: {
                 code: 200,
                 message: 'payment_session_created',
               },
               data: {
                 order: OrderSerializer.new(order).as_json,
                 payment_url: new_session.url,
               },
             },
             status: :ok
    end
  end

  def update
    authorize @order

    if @order.update(order_params)
      ActionCable.server.broadcast(
        'admin:order',
        { type: 'ORDER_UPDATED', payload: OrderSerializer.new(@order).as_json },
      )

      render json: {
               status: {
                 code: 200,
                 message: 'order_updated_successfully',
               },
               data: OrderSerializer.new(@order).as_json,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'order_update_failed',
               },
               data: nil,
               errors: @order.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def destroy
    authorize @order

    if @order.destroy
      render json: {
               status: {
                 code: 200,
                 message: 'order_deleted_successfully',
               },
               data: OrderSerializer.new(@order).as_json,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'order_deletion_failed',
               },
               data: nil,
               errors: @order.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def remove; end

  private

  def set_order
    @order = Order.find(params[:id])
  end

  def authorize_order
    authorize @order
  end

  def order_params
    params.permit(
      :shipping_address_id,
      :payment_method,
      :note,
      :status,
      order_items: %i[quantity book_id],
    )
  end

  # ✅ Strong params for search/filter/sort
  def filter_params
    params.permit(:query, :search, :sort_by, :status, :page, :per_page)
  end
end
