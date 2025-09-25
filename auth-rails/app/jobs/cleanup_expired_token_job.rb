class CleanupExpiredTokensJob
  include Sidekiq::Worker
  sidekiq_options queue: :default

  def perform
    expired_tokens = Doorkeeper::AccessToken.expired

    expired_tokens.find_each(&:destroy)
  end
end
