class Api::V1::ConfirmationsController < Devise::ConfirmationsController
  respond_to :json

  def create
    self.resource = resource_class.send_confirmation_instructions(confirmation_params)

    if successfully_sent?(resource)
      render json: { message: "Email sent" }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])

    if resource.errors.empty?
      render json: { message: 'Your email has been confirmed' }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def confirmation_params
    params.permit(:email)
  end
end
