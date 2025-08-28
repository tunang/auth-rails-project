class User < ApplicationRecord

  has_many :cart_items, dependent: :destroy
  has_many :cart_books, through: :cart_items, source: :book
  has_many :addresses, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :order_books, through: :orders, source: :book

  enum :role, { user: 'user', admin: 'admin' }

  # Mặc định mỗi user là 'user' nếu không khai báo
  after_initialize { self.role ||= 'user' }

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :validatable,
         :confirmable

end
