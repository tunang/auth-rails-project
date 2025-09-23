class OrdersChannel < ApplicationCable::Channel
  def subscribed
    # Stream for current_user orders
    stream_for current_user
  end

  def unsubscribed
    # cleanup
  end
end
