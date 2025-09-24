# app/workers/hard_delete_cron_job.rb
class HardDeleteCronJob
  include Sidekiq::Worker
  sidekiq_options queue: :default

  def perform
    hard_delete_books
    hard_delete_authors
    hard_delete_categories
  end

  private

  def hard_delete_books
    Book
      .only_deleted
      .where('deleted_at < ?', AppConstants::Cleanup::HARD_DELETE_AFTER.ago)
      .find_each { |book| safe_destroy(book, 'Book') }
  end

  def hard_delete_authors
    Author
      .only_deleted
      .where('deleted_at < ?', AppConstants::Cleanup::HARD_DELETE_AFTER.ago)
      .find_each { |author| safe_destroy(author, 'Author') }
  end

  def hard_delete_categories
    Category
      .only_deleted
      .where('deleted_at < ?', AppConstants::Cleanup::HARD_DELETE_AFTER.ago)
      .find_each { |category| safe_destroy(category, 'Category') }
  end

  def safe_destroy(record, type)
    record.really_destroy!
  rescue Elastic::Transport::Transport::Errors::NotFound => e
    Rails
      .logger.warn "[HardDeleteCronJob] ⚠️ #{type} ID=#{record.id} missing in Elasticsearch: #{e.message}"
    record.delete
  rescue => e
    Rails
      .logger.error "[HardDeleteCronJob] ❌ Failed to delete #{type} ID=#{record.id} - #{e.class}: #{e.message}"
  end
end
