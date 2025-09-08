class AddDeletedAtToActiveStorageAttachments < ActiveRecord::Migration[8.0]
  def change
    add_column :active_storage_attachments, :deleted_at, :datetime
    add_index :active_storage_attachments, :deleted_at
  end
end
