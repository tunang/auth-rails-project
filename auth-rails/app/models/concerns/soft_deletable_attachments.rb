# app/models/concerns/soft_deletable_attachments.rb
module SoftDeletableAttachments
  extend ActiveSupport::Concern

  included do
    before_destroy :soft_delete_attachments, prepend: true
    before_restore :restore_attachments, prepend: true
  end

  private

  def soft_delete_attachments
    return unless persisted?

    reflections.each do |name, reflection|
      if reflection.macro == :has_one_attached
        send(name)&.attachment&.destroy if send(name).attached?
      elsif reflection.macro == :has_many_attached
        send(name)&.each(&:destroy) if send(name).attached?
      end
    end
  end

  def restore_attachments
    return unless deleted_at

    reflections.each do |name, reflection|
      if reflection.macro == :has_one_attached
        restore_attachment(name)
      elsif reflection.macro == :has_many_attached
        restore_attachments_collection(name)
      end
    end
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
