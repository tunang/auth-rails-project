class CreateStripeProductJob < ApplicationJob
  queue_as :default

  sidekiq_options retry: 3

  def perform(book_id)
    # Do something later
    book = Book.find_by_id book_id
    return if book.synced?

    stripe_data = StripeService.create_product_with_price(book)
    book.update!(
      stripe_product_id: stripe_data[:product].id,
      stripe_price_id: stripe_data[:price].id,
      sync_status: :synced
    )
  rescue StripeService::StripeError => e
    book.update!(sync_status: :failed)
    raise e
  end
end
