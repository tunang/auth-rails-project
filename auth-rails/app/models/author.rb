class Author < ApplicationRecord
  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks
  acts_as_paranoid

  has_many :book_authors, dependent: :destroy
  has_many :books, through: :book_authors
  has_one_attached :photo

  validates :name, presence: true

  settings do
    mappings dynamic: false do
      indexes :name,        type: :text, analyzer: 'standard'
      indexes :nationality, type: :text, analyzer: 'standard'
    end
  end

  def as_indexed_json(_options = {})
    {
      id: id,
      name: name,
      nationality: nationality
    }
  end

  # ✅ same style as Category
  def self.search_by_name(query)
    __elasticsearch__.search(
      {
        query: {
          multi_match: {
            query: query,
            fields: %w[name nationality],
            type: 'phrase_prefix'
          }
        }
      }
    ).records
  end
end
