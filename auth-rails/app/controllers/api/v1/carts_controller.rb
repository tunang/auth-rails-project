class Api::V1::CartsController < ApplicationController
  before_action :doorkeeper_authorize!

  def show
    authorize :cart, :show?
    cart_items = current_user.cart_items.includes(:book)

    render json: {
             status: {
               code: 200,
               message: 'Cart loaded successfully',
             },
             data: cart_items.map do |item|
               {
                 quantity: item.quantity,
                 book: BookSerializer.new(item.book).as_json,
               }
             end,
           },
           status: :ok
  end

  def add_item
    authorize :cart, :add_item?
    book = Book.find(params[:book_id])
    item = current_user.cart_items.find_or_initialize_by(book:)
    item.quantity += params[:quantity].to_i

    if item.save
      render json: {
               status: {
                 code: 200,
                 message: 'item_added',
               },
               data: {
                 quantity: item.quantity,
                 book: BookSerializer.new(item.book).as_json,
               },
             },
             status: :ok
    else
      render_validation_errors(item)
    end
  end

  def update_item
    authorize :cart, :update_item?
    item = current_user.cart_items.find_by(book_id: params[:book_id])

    if item.nil?
      return render_not_found('Cart item not found')
    end

    item.quantity = params[:quantity].to_i
    if item.save
      render json: {
               status: {
                 code: 200,
                 message: "item_updated",
               },
               data: {
                 quantity: item.quantity,
                 book: BookSerializer.new(item.book).as_json,
               },
             },
             status: :ok
    else
      render_validation_errors(item)
    end
  end

  def remove_item
    authorize :cart, :remove_item?
    item = current_user.cart_items.find_by(book_id: params[:id])

    if item
      item.destroy
      render json: {
               status: {
                 code: 200,
                 message: 'item_removed',
               },
               data: {
                 quantity: item.quantity,
                 book: BookSerializer.new(item.book).as_json,
               },
             },
             status: :ok
    else
      render_not_found('Item not found')
    end
  end

  def clear
    authorize :cart, :clear?
    current_user.cart_items.destroy_all
    render json: {
             status: {
               code: 200,
               message: 'cart_cleared',
             },
             data: nil,
           },
           status: :ok
  end

  private

def render_validation_errors(record)
  render json: {
    status: {
      code: 422,
      message: 'validation_failed'
    },
    data: nil,
    errors: record.errors.full_messages
  }, status: :unprocessable_entity
end

def render_not_found(message)
  render json: {
    status: {
      code: 404,
      message: 'not_found'
    },
    data: nil,
    errors: [
     message
    ]
  }, status: :not_found
end

end
