class CreateAddresses < ActiveRecord::Migration[8.0]
  def change
    create_table :addresses do |t|
      t.references :user, null: false, foreign_key: true
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :address_line_1, null: false
      t.string :address_line_2
      t.string :city, null: false
      t.string :state, null: false
      t.string :postal_code, null: false
      t.string :country, null: false
      t.string :phone
      t.boolean :is_default, default: false

      t.timestamps
    end
  end
end
