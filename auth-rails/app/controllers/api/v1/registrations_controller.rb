class Api::V1::RegistrationsController < ApplicationController
    respond_to :json

    def create
        user = User.new(user_params)
        if user.save
            # Devise auto send verify email after account, if keep this line, email's sent twice
            # user.send_confirmation_instructions 
            render json: {message: "pls check ur email"}, status: :created
        else
            render json: {errors: user.errors.full_messages}, status: :unprocessable_entity
        end
    end


    private
    def user_params
        params.permit(:email, :name, :password, :confirmation_password)
    end
end
