class Category < ApplicationRecord
  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks
  acts_as_paranoid

  has_many :book_categories, dependent: :destroy
  has_many :books, through: :book_categories
  
  belongs_to :parent, class_name: 'Category', optional: true
  has_many :children, class_name: 'Category', foreign_key: 'parent_id', dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :parent_id }

  scope :main_categories, -> { where(parent_id: nil) }

  settings do
    mappings dynamic: false do
      indexes :name, type: :text, analyzer: 'standard'
    end
  end

  def as_indexed_json(_options = {})
    {
      id: id,
      name: name
    }
  end

  def self.search_by_name(query)
    __elasticsearch__.search(
      {
        query: {
          match_phrase_prefix: { name: query }
        }
      }
    ).records
  end

end
