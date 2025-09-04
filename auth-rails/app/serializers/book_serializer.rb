# app/serializers/book_serializer.rb
class BookSerializer
  def initialize(book)
    @book = book
  end

  def as_json(*)
    {
      id: book.id,
      title: book.title,
      description: book.description,
      price: book.price,
      discount_percentage: book.discount_percentage,
      stock_quantity: book.stock_quantity,
      featured: book.featured,
      cover_image_url: cover_image_url,
      sample_page_urls: sample_page_urls,
      authors: authors_data,
      categories: categories_data,
      sync_status: book.sync_status,
      created_at: book.created_at,
      updated_at: book.updated_at
    }
  end

  private
  
  attr_reader :book

  def cover_image_url
    return unless book.cover_image.attached?
    Rails.application.routes.url_helpers.rails_blob_url(book.cover_image, only_path: true)
  end

  def sample_page_urls
    book.sample_pages.map do |page|
      Rails.application.routes.url_helpers.rails_blob_url(page, only_path: true)
    end
  end

  def authors_data
    book.authors.map do |author|
      {
        id: author.id,
        name: author.name
      }
    end
  end

  def categories_data
    book.categories.map do |category|
      {
        id: category.id,
        name: category.name
      }
    end
  end
end
