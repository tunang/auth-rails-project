class Order < ApplicationRecord
  acts_as_paranoid
  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  belongs_to :user
  belongs_to :shipping_address, -> { with_deleted }, class_name: 'Address'

  has_many :order_items, dependent: :destroy
  has_many :books, through: :order_items

  validates :status, presence: true
  validates :total_amount, presence: true, numericality: { greater_than: 0 }

  enum :status,
       {
         pending: 0,
         confirmed: 1,
         processing: 2,
         shipped: 3,
         delivered: 4,
         cancelled: 5,
         refunded: 6,
       }

  before_create :generate_order_number

  # 🔎 Elasticsearch Mapping
  settings index: { number_of_shards: 1 } do
    mappings dynamic: false do
      indexes :order_number, type: :text, analyzer: 'standard'
      indexes :status, type: :keyword
      indexes :created_at,
              type: :date,
              format: 'strict_date_optional_time||epoch_millis'
      indexes :user, type: :object do
        indexes :id, type: :integer
        indexes :name, type: :text, analyzer: 'standard'
        indexes :email, type: :text, analyzer: 'standard'
      end
    end
  end

  def as_indexed_json(_options = {})
    {
      id: id,
      order_number: order_number,
      status: status,
      created_at: created_at, # must be here
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  end

  # ✅ Search by order_number, status, or user info
  def self.search_by_name(query)
    __elasticsearch__.search(
      {
        query: {
          multi_match: {
            query: query,
            fields: %w[order_number user.name user.email],
            type: 'phrase_prefix',
          },
        },
      },
    ).records
  end

  def self.search_orders(query: nil, sort_by: nil, status: nil)
    must_conditions = []
    filter_conditions = []

    # Full-text search across multiple fields
    if query.present?
      must_conditions << {
        multi_match: {
          query: query,
          fields: %w[order_number user.name user.email],
          type: 'phrase_prefix',
        },
      }
    end

    filter_conditions << { term: { status: status } } if status.present?

    # Sorting
    sort =
      case sort_by
      when 'newest'
        [{ created_at: { order: 'desc' } }]
      else
        [{ _score: { order: 'desc' } }] # default: relevance
      end

    __elasticsearch__.search(
      {
        query: {
          bool: {
            must: must_conditions,
            filter: filter_conditions,
          },
        },
        sort: sort,
      },
    )
  end

  private

  def generate_order_number
    self.order_number =
      "ORD#{Time.current.strftime('%Y%m%d')}#{SecureRandom.hex(4).upcase}"
  end
end
