class Api::V1::PasswordsController < ApplicationController
    respond_to :json

    #Post Api/V1/forgot
    def forgot
        user = User.find_by(email: params[:email])

        if user.present?
            user.send_reset_password_instructions
            render json: {messages: "Reset email sent to #{params[:email]}"}, status: :ok
        else
            render json: {errors: "Email not found"}, status: :not_found
        end
    end


    def reset
        user = User.reset_password_by_token(reset_password_params)

        if user.errors.empty?
            render json: {messages: "Password successfully reset"}, status: :ok
        else
            render json: {messages: user.errors.full_messages}, status: :unprocessable_entity
        end
    end 


    private
    def reset_password_params
        params.permit(:reset_password_token, :password, :confirmation_password)
    end
end