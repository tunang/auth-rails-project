class CreateBooks < ActiveRecord::Migration[8.0]
  def change
    create_table :books do |t|
      t.string :title, null: false, limit: 500
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.integer :stock_quantity, default: 0, null: false

      # Business logic fields
      t.boolean :featured, default: false, null: false
      t.boolean :active, default: true, null: false

      # Inventory and sales tracking
      t.integer :sold_count, default: 0, null: false
      t.decimal :cost_price, precision: 10, scale: 2 # for profit calculation
      t.decimal :discount_percentage, precision: 5, scale: 2, default: 0.0
      t.timestamps
    end
  end
end
