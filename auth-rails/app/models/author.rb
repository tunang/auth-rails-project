class Author < ApplicationRecord
  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks
  acts_as_paranoid

  has_many :book_authors, dependent: :destroy
  has_many :books, through: :book_authors
  has_one_attached :photo

  validates :name, presence: true

  before_destroy :soft_delete_attachments, prepend: true
  before_restore :restore_attachments, prepend: true

  settings do
    mappings dynamic: false do
      indexes :name, type: :text, analyzer: 'standard'
      indexes :nationality, type: :text, analyzer: 'standard'
    end
  end

  def as_indexed_json(_options = {})
    { id: id, name: name, nationality: nationality }
  end

  # ✅ same style as Category
  def self.search_by_name(query)
    __elasticsearch__.search(
      {
        query: {
          multi_match: {
            query: query,
            fields: %w[name nationality],
            type: 'phrase_prefix',
          },
        },
      },
    ).records
  end

  private

  def soft_delete_attachments
    return unless persisted?

    # Với has_one_attached → cần .attachment
    photo&.attachment&.destroy if photo.attached?
  end

  def restore_attachments
    return unless deleted_at

    # Khôi phục attachment và blob
    restore_attachment(:photo)
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
