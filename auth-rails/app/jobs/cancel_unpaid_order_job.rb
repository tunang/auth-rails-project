# app/jobs/cancel_unpaid_order_job.rb
class CancelUnpaidOrderJob < ApplicationJob
  queue_as :default

  def perform(order_id)
    order = Order.includes(:order_items).find_by(id: order_id, status: :pending)
    return unless order
    return unless order.payment_status == "pending"

    ActiveRecord::Base.transaction do
      # 1. Restore book stock
      order.order_items.each do |item|
        book = item.book
        next unless book

        book.increment!(:stock_quantity, item.quantity)
      end

      # 2. Cancel the order
      order.update!(status: :cancelled, payment_status: "failed")

      Rails.logger.info "✅ Order ##{order.id} canceled & stock restored"
    end
  end
end
