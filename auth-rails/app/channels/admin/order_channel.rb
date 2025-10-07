# app/channels/admin/order_channel.rb
module Admin
  class OrderChannel < ApplicationCable::Channel
    def subscribed
      reject unless current_user.role == 'admin'
      stream_from 'admin_orders' # match your broadcast name
    end
  end
end
