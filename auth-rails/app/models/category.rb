class Category < ApplicationRecord
  acts_as_paranoid

  has_many :book_categories, dependent: :destroy
  has_many :books, through: :book_categories
  belongs_to :parent, class_name: 'Category', optional: true
  has_many :children, class_name: 'Category', foreign_key: 'parent_id', dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :parent_id }

  scope :main_categories, -> { where(parent_id: nil) }
end
