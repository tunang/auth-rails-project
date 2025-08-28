class CreateAuthors < ActiveRecord::Migration[8.0]
  def change
    create_table :authors do |t|
      t.string :name, null: false
      t.string :nationality, null: false
      t.date :birth_date, null: false
      t.text :biography

      t.timestamps
    end
  end
end
