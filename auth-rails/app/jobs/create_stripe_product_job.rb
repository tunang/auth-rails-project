class CreateStripeProductJob < ApplicationJob
  queue_as :default

  sidekiq_options retry: 3

  def perform(book_id)
    # Do something later
    book = Book.find_by_id book_id
    return if book.synced?

    upload_stripe_book = book.dup
    ##I dont know, sth stripe need this fkin below to work normally
    # upload_stripe_book.price = book.price

    # if book.discount_percentage > 0
    #   upload_stripe_book.price -= book.price * (book.discount_percentage / 100)
    # end

    stripe_data = StripeService.create_product_with_price(upload_stripe_book)
    book.update!(
      stripe_product_id: stripe_data[:product].id,
      stripe_price_id: stripe_data[:price].id,
      sync_status: :synced,
    )
  rescue StripeService::StripeError => e
    book.update!(sync_status: :failed)
    raise e
  end
end
