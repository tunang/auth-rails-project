module Admin
  class OrderChannel < ApplicationCable::Channel
    def subscribed
      reject unless current_user.role == 'admin'
      stream_from 'admin:order'
    end

    def unsubscribed
      # cleanup
    end
  end
end
