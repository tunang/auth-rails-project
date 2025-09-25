class Order < ApplicationRecord
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

  private

  def generate_order_number
    self.order_number =
      "ORD#{Time.current.strftime('%Y%m%d')}#{SecureRandom.hex(4).upcase}"
  end
end
