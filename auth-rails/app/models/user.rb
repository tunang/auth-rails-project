class User < ApplicationRecord

  has_many :addresses, dependent: :destroy
  has_many :cart_items, dependent: :destroy


  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :validatable,
         :confirmable
end
