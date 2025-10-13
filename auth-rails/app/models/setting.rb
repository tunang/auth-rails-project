class Setting < ApplicationRecord
  validates :tax_rate, numericality: { greater_than_or_equal_to: 0 }
  validates :shipping_cost, numericality: { greater_than_or_equal_to: 0 }

  def self.current
    # Tìm bản ghi đầu tiên, nếu không có thì tạo mới
    # Dùng `||=` để cache kết quả, tránh truy vấn database nhiều lần
    @current_setting ||=
      Setting.first_or_create!(
        tax_rate: 0.1, # Giá trị mặc định ban đầu
        shipping_cost: 5, # Giá trị mặc định ban đầu
      )
  end
end
