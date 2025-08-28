class Author < ApplicationRecord
  acts_as_paranoid
  has_many :book_authors, dependent: :destroy
  has_many :books, through: :book_authors
  has_one_attached :photo


  validates :name, presence: true
end
