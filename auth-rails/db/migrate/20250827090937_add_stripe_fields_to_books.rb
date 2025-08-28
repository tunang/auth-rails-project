class AddStripeFieldsToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :stripe_product_id, :string
    add_column :books, :stripe_price_id, :string

    add_index :books, :stripe_product_id
    add_index :books, :stripe_price_id
  end
end
