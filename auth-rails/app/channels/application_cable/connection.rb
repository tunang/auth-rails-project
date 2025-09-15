# app/channels/application_cable/connection.rb
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      token = request.params[:token]
      access_token = Doorkeeper::AccessToken.by_token(token)

      if access_token&.accessible?
        User.find(access_token.resource_owner_id)
      else
        reject_unauthorized_connection
      end
    end
  end
end
