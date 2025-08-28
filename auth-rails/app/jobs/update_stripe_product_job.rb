class UpdateStripeProductJob < ApplicationJob
  queue_as :default

  sidekiq_options retry: 3

  def perform(book_id)
    # Do something later
    book = Book.find(book_id)
    stripe_data = StripeService.update_product(book)
    book.update!(
      sync_status: :synced
    )
  rescue StripeService::StripeError => e
    book.update!(sync_status: failed)
    raise e
  end
end
