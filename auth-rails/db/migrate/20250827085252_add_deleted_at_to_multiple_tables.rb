class AddDeletedAtToMultipleTables < ActiveRecord::Migration[8.0]
  def change
    add_column :book_authors, :deleted_at, :datetime
    add_index  :book_authors, :deleted_at

    add_column :book_categories, :deleted_at, :datetime
    add_index  :book_categories, :deleted_at

    add_column :authors, :deleted_at, :datetime
    add_index  :authors, :deleted_at
  end
end
