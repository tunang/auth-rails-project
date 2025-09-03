class Api::V1::ConfirmationsController < Devise::ConfirmationsController
  respond_to :json

  def create
    self.resource =
      resource_class.send_confirmation_instructions(confirmation_params)

    if successfully_sent?(resource)
      render json: {
               status: {
                 code: 200,
                 message: 'confirmation_email_sent',
               },
               data: nil,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'confirmation_email_failed',
               },
               data: nil,
               errors: resource.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])

    if resource.errors.empty?
      render json: {
               status: {
                 code: 200,
                 message: 'Your email has been confirmed',
               },
               data: nil,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Email confirmation failed',
               },
               errors: resource.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  private

  def confirmation_params
    params.permit(:email)
  end
end
