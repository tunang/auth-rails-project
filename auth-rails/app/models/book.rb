class Book < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: %i[slugged history]
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

  before_destroy :soft_delete_attachments, prepend: true
  before_restore :restore_attachments, prepend: true

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
      indexes :authors, type: :keyword # 👈 use keyword for filtering
      indexes :categories, type: :keyword # 👈 use keyword for filtering
      indexes :created_at, type: :date
      indexes :featured, type: :boolean
    end
  end

  def as_indexed_json(_options = {})
    {
      title: title,
      price: price,
      stock_quantity: stock_quantity,
      authors: authors.map(&:name),
      categories: categories.map(&:name),
      created_at: created_at,
      featured: featured,
    }
  end

  # 🔎 Advanced search with filters & sorting
  def self.search_books(
    query: nil,
    category: nil,
    author: nil,
    min_price: nil,
    max_price: nil,
    in_stock: nil,
    sort_by: nil,
    featured: nil
  )
    must_conditions = []
    filter_conditions = []

    # Full-text search across multiple fields
    if query.present?
      must_conditions << {
        multi_match: {
          query: query,
          fields: %w[title],
          type: 'phrase_prefix',
        },
      }
    end

    # Filters
    if category.present?
      filter_conditions << { terms: { categories: [category] } }
    end
    filter_conditions << { terms: { authors: [author] } } if author.present?
    if min_price.present?
      filter_conditions << { range: { price: { gte: min_price.to_f } } }
    end
    if max_price.present?
      filter_conditions << { range: { price: { lte: max_price.to_f } } }
    end
      if in_stock.to_s == 'true'
      # Find books with quantity greater than 0
      filter_conditions << { range: { stock_quantity: { gt: 0 } } }
    elsif in_stock.to_s == 'false'
      # Find books with quantity of exactly 0
      filter_conditions << { term: { stock_quantity: 0 } }
    end

    filter_conditions << { term: { featured: true } } if featured.to_s == 'true'

    # Sorting
    sort =
      case sort_by
      when 'price_asc'
        [{ price: { order: 'asc' } }]
      when 'price_desc'
        [{ price: { order: 'desc' } }]
      when 'title'
        [{ title: { order: 'asc' } }]
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

  # legacy simple search
  def self.search_by_name(query)
    __elasticsearch__.search(
      {
        query: {
          multi_match: {
            query: query,
            fields: %w[title categories authors],
            type: 'phrase_prefix',
          },
        },
      },
    ).records
  end

  def destroy_fully!
    cover_image.purge if cover_image.attached?
    sample_pages.purge if sample_pages.attached?
    super
  end

  private

  def soft_delete_attachments
    return unless persisted?

    cover_image&.attachment&.destroy if cover_image.attached?
    sample_pages&.each(&:destroy) if sample_pages.attached?
  end

  def restore_attachments
    return unless deleted_at

    restore_attachment(:cover_image)
    restore_attachments_collection(:sample_pages)
  end

  def restore_attachment(name)
    att =
      ActiveStorage::Attachment.unscoped.find_by(
        record_type: self.class.name,
        record_id: id,
        name: name.to_s,
      )
    return unless att&.deleted?

    att.restore
    blob = ActiveStorage::Blob.unscoped.find_by(id: att.blob_id)
    blob&.restore if blob&.deleted?
  end

  def restore_attachments_collection(name)
    attachments =
      ActiveStorage::Attachment.unscoped.where(
        record_type: self.class.name,
        record_id: id,
        name: name.to_s,
      )

    attachments.each do |att|
      next unless att.deleted?

      att.restore
      blob = ActiveStorage::Blob.unscoped.find_by(id: att.blob_id)
      blob&.restore if blob&.deleted?
    end
  end
end
