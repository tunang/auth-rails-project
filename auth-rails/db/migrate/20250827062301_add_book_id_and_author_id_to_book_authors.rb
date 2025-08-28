class AddBookIdAndAuthorIdToBookAuthors < ActiveRecord::Migration[8.0]
  def change
    add_column :book_authors, :book_id, :integer
    add_column :book_authors, :author_id, :integer
  end

end
