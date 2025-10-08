class User < ApplicationRecord
  acts_as_paranoid


  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  has_many :cart_items, dependent: :destroy
  has_many :cart_books, through: :cart_items, source: :book
  has_many :addresses, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :order_books, through: :orders, source: :book

  enum :role, { user: 'user', staff: 'staff', admin: 'admin' }

  # Mặc định mỗi user là 'user' nếu không khai báo
  after_initialize { self.role ||= 'user' }

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :validatable,
         :confirmable

  index_name "users"
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
      indexes :email, type: :text
      indexes :name, type: :text
    end
  end

  def as_indexed_json(_options = {})
    { email: email, name: name }
  end

  # 🔎 Advanced search with filters & sorting
  def self.search_users(query: nil)
    must_conditions = []
    filter_conditions = []

    # Full-text search across multiple fields
    if query.present?
      must_conditions << {
        multi_match: {
          query: query,
          fields: %w[email name],
          type: 'phrase_prefix',
        },
      }
    end

    __elasticsearch__.search(
      { query: { bool: { must: must_conditions, filter: filter_conditions } } },
    )
  end
end
