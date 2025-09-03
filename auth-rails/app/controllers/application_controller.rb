class ApplicationController < ActionController::API
  include Pundit::Authorization

  before_action :configure_permitted_parameters, if: :devise_controller?

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name avatar])
    devise_parameter_sanitizer.permit(:account_update, keys: %i[name avatar])
  end

  private

  # ánh xạ current_user từ doorkeeper token
  def current_user
    return unless doorkeeper_token
    @current_user ||= User.find_by(id: doorkeeper_token[:resource_owner_id])
  end

  def user_not_authorized(exception)
    render json: {
             status: 'error',
             data: nil,
             errors: [
               {
                 code: 'NOT_AUTHORIZED',
                 title: 'Forbidden',
                 detail:
                   "BEEP BEEP! You are not allowed to perform #{exception.query} on #{exception.record.class}",
               },
             ],
           },
           status: :forbidden
  end

  def record_not_found(exception)
    render json: {
             status: 'error',
             data: nil,
             errors: [
               {
                 code: 'RECORD_NOT_FOUND',
                 title: 'Not Found',
                 detail: exception.message,
               },
             ],
           },
           status: :not_found
  end

  # 🔹 Customize Doorkeeper when no/invalid access token
  def doorkeeper_unauthorized_render_options(error: nil)
    {
      json: {
        status: 'error',
        data: nil,
        errors: [
          {
            code: 'INVALID_TOKEN',
            title: 'Unauthorized',
            detail: 'Access token is missing or invalid',
          },
        ],
      },
    }
  end
end
