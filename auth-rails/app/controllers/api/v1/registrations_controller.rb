class Api::V1::RegistrationsController < ApplicationController
  respond_to :json

  def create
    user = User.new(user_params)

    if user.save
      # Devise auto send verify email after account, if keep this line, email's sent twice
      # user.send_confirmation_instructions
      render json: {
               status: {
                 code: 201,
                 message:
                   'User created successfully. Please check your email to confirm your account.',
               },
               data: user,
             },
             status: :created
    else
      render json: {
               status: {
                 code: 422,
                 message: 'User creation failed',
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
