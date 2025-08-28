# app/models/book.rb
class Book < ApplicationRecord
  acts_as_paranoid

  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  enum :sync_status, { pending: 0, synced: 1, failed: 2 }

  has_one_attached :cover_image
  has_many_attached :sample_pages

  validates :title, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :stock_quantity,
            presence: true,
            numericality: {
              greater_than_or_equal_to: 0,
            }

  has_many :book_authors, dependent: :destroy
  has_many :authors, through: :book_authors
  has_many :book_categories, dependent: :destroy
  has_many :categories, through: :book_categories
  has_many :order_items, dependent: :destroy
  has_many :cart_items, dependent: :destroy

  index_name "books_#{Rails.env}"

  settings index: {
             number_of_shards: 1,
             analysis: {
               analyzer: {
                 default: {
                   type: 'standard',
                 },
               },
             },
           } do
    mappings dynamic: false do
      indexes :title, type: :text
      indexes :price, type: :float
      indexes :stock_quantity, type: :integer
      indexes :authors, type: :text
      indexes :categories, type: :text
    end
  end

  def as_indexed_json(_options = {})
    {
      title: title,
      price: price,
      stock_quantity: stock_quantity,
      authors: authors.map(&:name),
      categories: categories.map(&:name),
    }
  end
end
