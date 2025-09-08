# config/initializers/active_storage_paranoid.rb

Rails.application.config.to_prepare do
  require 'active_storage/engine'

  # Soft-delete cho Blob
  ActiveStorage::Blob.class_eval do
    acts_as_paranoid
  end

  # Soft-delete cho Attachment → soft-delete blob SAU KHI attachment đã được soft-delete
  ActiveStorage::Attachment.class_eval do
    acts_as_paranoid

    after_destroy :soft_delete_blob

    private

    def soft_delete_blob
      blob&.destroy if blob&.persisted?
    end
  end
end