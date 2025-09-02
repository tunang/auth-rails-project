class Api::V1::UsersController < ApplicationController
  before_action :doorkeeper_authorize!

  def me
    render json: {
             status: {
               code: 200,
               message: 'Get current user successfully.',
             },
             user:
               UserSerializer.new(current_user).serializable_hash[:data][
                 :attributes
               ],
           },
           status: :ok
  end
end
