# app/jobs/stripe_sync_book_job.rb
class StripeSyncBookJob
  include Sidekiq::Job

  def perform(book_id)
    book = Book.find(book_id)

    # Nếu book đã có stripe_product_id thì update
    if book.stripe_product_id.present?
      StripeService.update_product(book)
    else
      # Tạo mới product + price
      result = StripeService.new.create_product_with_price(book)

      book.update!(
        stripe_product_id: result[:product].id,
        stripe_price_id: result[:price].id
      )
    end
  rescue ActiveRecord::RecordNotFound
    Rails.logger.error "Book #{book_id} not found for Stripe sync"
  rescue Stripe::StripeError => e
    Rails.logger.error "Stripe error for Book #{book_id}: #{e.message}"
  end
end
