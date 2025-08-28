class Address < ApplicationRecord
  acts_as_paranoid

  belongs_to :user
  # has_many :orders

  validates :first_name,
            :last_name,
            :address_line_1,
            :city,
            :state,
            :postal_code,
            :country,
            presence: true
end
