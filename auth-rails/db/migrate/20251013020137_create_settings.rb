class CreateSettings < ActiveRecord::Migration[8.0]
  def change
    create_table :settings do |t|
      t.decimal :tax_rate
      t.decimal :shipping_cost

      t.timestamps
    end
  end
end
