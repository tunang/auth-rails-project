class Api::V1::RegistrationsController < ApplicationController
  respond_to :json

  def create
    user = User.find_by()

    user = User.new(user_params)

    if user.save
      # Devise auto send verify email after account, if keep this line, email's sent twice
      # user.send_confirmation_instructions
      render json: {
               status: {
                 code: 201,
                 message: 'user_created_successfully',
               },
               data: UserSerializer.new(user).as_json,
             },
             status: :created
    else
      render json: {
               status: {
                 code: 422,
                 message: "user_creation_failed",
               },
               errors: user.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.permit(:email, :name, :password, :confirmation_password)
  end
end
