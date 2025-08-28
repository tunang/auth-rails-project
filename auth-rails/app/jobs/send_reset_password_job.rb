class SendResetPasswordJob < ApplicationJob
  queue_as :default

  def perform(user_id, token)
    user = User.find(user_id)
    Devise::Mailer.reset_password_instructions(user, token).deliver_later
  rescue StandardError => e
    Rails.logger.error "Failed to send verification email: #{e.message}"
    raise e
  end
end