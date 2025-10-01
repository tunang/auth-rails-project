class Api::V1::StatsController < ApplicationController
  before_action :doorkeeper_authorize!

  def statics
    total_book = Book.count
    total_order = Order.count
    total_out_of_stock_book = Book.where(stock_quantity: 0)

    render json: {
             status: {
               code: 200,
               message: 'Static successfully',
             },
             data: {
              total_book: total_book,
              total_order: total_order
             },
    
           },
           status: :ok
  end

  private

  def today_revenue_calculate; end
end
