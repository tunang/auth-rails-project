class AddSyncStatusToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :sync_status, :integer, default: 0
  end
end
