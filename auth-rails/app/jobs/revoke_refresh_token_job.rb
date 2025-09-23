#Run time config in config/schedule.yml

class RevokeRefreshTokenJob
  include Sidekiq::Worker
  queue_as :default

  def perform
    
  end
end