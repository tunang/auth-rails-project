class AddDurationInMonthsToCoupons < ActiveRecord::Migration[8.0]
  def change
    add_column :coupons, :duration_in_months, :integer
  end
end
