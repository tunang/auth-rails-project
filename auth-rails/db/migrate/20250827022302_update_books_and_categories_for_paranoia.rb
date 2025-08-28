class UpdateBooksAndCategoriesForParanoia < ActiveRecord::Migration[8.0]
  def change
    # Bảng books
    remove_column :books, :active, :boolean
    add_column :books, :deleted_at, :datetime
    add_index  :books, :deleted_at

    # Bảng categories
    remove_column :categories, :active, :boolean
    add_column :categories, :deleted_at, :datetime
    add_index  :categories, :deleted_at
  end
end
