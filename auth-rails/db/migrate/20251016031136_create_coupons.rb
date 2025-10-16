class CreateCoupons < ActiveRecord::Migration[8.0]
  def change
    create_table :coupons do |t|
      t.string  :stripe_coupon_id
      t.string  :code, null: false
      t.float   :percent_off
      t.integer :amount_off
      t.string  :duration, null: false
      t.boolean :active, default: false, null: false

      t.timestamps
    end

    add_index :coupons, :code, unique: true
  end
end
