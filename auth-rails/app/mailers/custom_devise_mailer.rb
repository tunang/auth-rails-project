# app/mailers/custom_devise_mailer.rb

class CustomDeviseMailer < Devise::Mailer
  include Devise::Controllers::UrlHelpers

  default template_path: 'devise/mailer'
  default from: ENV.fetch('DEFAULT_FROM_EMAIL', 'longprovip2508@gmail.com')

  
  def confirmation_instructions(record, token, opts = {})
    # Enqueue the job instead of sending directly
    SendVerificationEmailJob.perform_later(record.id, token)
  end

  def reset_password_instructions(record, token, opts = {})
    SendResetPasswordJob.perform_later(record.id, token)
  end
end
