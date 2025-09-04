class Api::V1::PasswordsController < ApplicationController
  respond_to :json

  def forgot
    user = User.find_by(email: params[:email])

    if user.present?
      user.send_reset_password_instructions
      render json: {
               status: {
                 code: 200,
                 message: 'reset_email_sent',
               },
               data: nil,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 404,
                 message: 'email_not_found',
               },
               data: nil,
               errors: ["Email #{params[:email]} not found"],
             },
             status: :not_found
    end
  end

  # POST /api/v1/reset
  def reset
    user = User.reset_password_by_token(reset_password_params)

    if user.errors.empty?
      render json: {
               status: {
                 code: 200,
                 message: 'password_successfully_reset',
               },
               data: nil,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'password_reset_failed',
               },
               errors: user.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  private

  def reset_password_params
    params.permit(:reset_password_token, :password, :password_confirmation)
  end
end
