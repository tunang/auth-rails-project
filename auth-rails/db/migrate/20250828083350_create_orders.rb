class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.string :order_number, null: false
      t.integer :status, null: false, default: 0
      t.decimal :subtotal, precision: 10, scale: 2, null: false
      t.decimal :tax_amount, precision: 10, scale: 2, default: 0.0
      t.decimal :shipping_cost, precision: 10, scale: 2, default: 0.0
      t.decimal :total_amount, precision: 10, scale: 2, null: false
      t.bigint :shipping_address_id, null: false
      t.string :payment_method
      t.string :payment_status
      t.string :tracking_number
      t.text :notes
      t.string :payment_link
      t.string :stripe_session_id

      t.timestamps
    end

    add_index :orders, :order_number, unique: true
    add_index :orders, :stripe_session_id, unique: true
    add_index :orders, [:user_id, :status]
    add_index :orders, :shipping_address_id
  end
end
