# app/jobs/send_verification_email_job.rb
class SendVerificationEmailJob < ApplicationJob
  queue_as :default

  def perform(user_id, token)
    user = User.find(user_id)
    Devise::Mailer.confirmation_instructions(user, token).deliver_later
  rescue StandardError => e
    Rails.logger.error "Failed to send verification email: #{e.message}"
    raise e
  end
end