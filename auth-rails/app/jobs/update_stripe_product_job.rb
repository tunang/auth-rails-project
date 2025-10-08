class UpdateStripeProductJob < ApplicationJob
  queue_as :default
  sidekiq_options retry: 3

  def perform(book_id)
    book = Book.find(book_id)

    # Create a detached copy to modify for Stripe
    upload_stripe_book = book.dup
    upload_stripe_book.price = book.price

    if book.discount_percentage.to_f > 0
      upload_stripe_book.price -= book.price * (book.discount_percentage / 100.0)
    end

    # Pass both the copy (for Stripe) and original (for DB update)
    StripeService.update_product_with_price(upload_stripe_book, book)

    # Mark original as synced
    book.update!(sync_status: :synced)
  rescue StripeService::StripeError => e
    book.update!(sync_status: :failed)
    raise e
  end
end
