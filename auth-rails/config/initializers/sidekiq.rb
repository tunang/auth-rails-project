require "sidekiq"
require "sidekiq-cron"

Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch("REDIS_URL", "redis://localhost:56379/0") }

  # Load cron jobs từ file riêng schedule.yml
  schedule_file = Rails.root.join("config/schedule.yml")
  if File.exist?(schedule_file)
    schedule = YAML.load_file(schedule_file) || {}
    Sidekiq::Cron::Job.load_from_hash(schedule)
  else
    Rails.logger.warn "[Sidekiq] config/schedule.yml not found, skip loading cron jobs"
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch("REDIS_URL", "redis://localhost:56379/0") }
end
