class Api::V1::StatsController < ApplicationController
  before_action :doorkeeper_authorize!

  def statics
    total_books = Book.count
    total_orders = Order.count
    total_out_of_stock_books = Book.where(stock_quantity: 0).count
    total_users = User.count
    pending_orders = Order.where(status: 'pending').count
    processing_orders = Order.where(status: 'processing').count
    delivered_orders = Order.where(status: 'delivered').count

    render json: {
             status: {
               code: 200,
               message: 'Statics successfully loaded',
             },
             data: {
               total_books: total_books,
               total_orders: total_orders,
               total_out_of_stock_books: total_out_of_stock_books,
               total_users: total_users,
               pending_orders: pending_orders,
               processing_orders: processing_orders,
               delivered_orders: delivered_orders,
             },
           },
           status: :ok
  end

  private

  def today_revenue_calculate; end
end
