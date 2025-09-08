class AddDeletedAtToActiveStorage < ActiveRecord::Migration[7.0]
  def change
    add_column :active_storage_blobs, :deleted_at, :datetime
    add_index :active_storage_blobs, :deleted_at
  end
end