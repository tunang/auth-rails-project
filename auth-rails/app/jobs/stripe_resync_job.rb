#Run time config in config/schedule.yml

class StripeResyncJob
  include Sidekiq::Worker
  queue_as :default

  def perform
    Book.failed.find_each do |book|
      CreateStripeProductJob.perform_later(book.id)
    end
  end
end
