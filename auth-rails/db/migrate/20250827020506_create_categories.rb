class CreateCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :categories do |t|
      t.string :name, null: false
      t.text :description
      t.references :parent, null: true, foreign_key: { to_table: :categories }
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :categories, [:parent_id, :name], unique: true
  end
end
