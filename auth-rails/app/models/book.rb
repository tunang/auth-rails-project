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

  before_destroy :soft_delete_attachments, prepend: true
  before_restore :restore_attachments, prepend: true

  # 🔎 Tìm kiếm theo title
  def self.search_by_name(query)
    __elasticsearch__.search(
      { query: { match_phrase_prefix: { title: query } } },
    ).records
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
  def destroy_fully!
    cover_image.purge if cover_image.attached?
    sample_pages.purge if sample_pages.attached?
    super
  end

  private

  def soft_delete_attachments
    return unless persisted?

    # Với has_one_attached → cần .attachment
    cover_image&.attachment&.destroy if cover_image.attached?

    # Với has_many_attached → mỗi phần tử đã là attachment → không cần .attachment
    sample_pages&.each(&:destroy) if sample_pages.attached?
  end

  def restore_attachments
    return unless deleted_at

    # Khôi phục attachment và blob
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

    # 🔥 DÙNG `unscoped` ĐỂ LẤY BLOB KỂ CẢ KHI ĐÃ SOFT-DELETE
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

      # 🔥 DÙNG `unscoped` CHO BLOB
      blob = ActiveStorage::Blob.unscoped.find_by(id: att.blob_id)
      blob&.restore if blob&.deleted?
    end
  end
end
