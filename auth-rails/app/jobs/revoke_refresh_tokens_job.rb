#Hard delete refresh token older than 7 days


class RevokeRefreshTokensJob
  include Sidekiq::Worker
  sidekiq_options queue: :default

  def perform(days = 7)
    tokens =
      Doorkeeper::AccessToken
        .where.not(refresh_token: nil)
        .where('created_at < ?', Time.current - 7.days)
    count = tokens.count

    Rails
      .logger.info "Deleting #{count} refresh tokens older than #{days} days..."

    tokens.delete_all # 💥 hard delete

    Rails.logger.info 'Deletion complete ✅'
  end
end
