class Api::V1::UsersController < ApplicationController
  before_action :doorkeeper_authorize!

  def me
    render json: {
             status: {
               code: 200,
               message: 'Get current user successfully.',
             },
             data:
               UserSerializer.new(current_user).as_json,
           },
           status: :ok
  end
end
