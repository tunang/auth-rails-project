class BookCategory < ApplicationRecord
  acts_as_paranoid

  belongs_to :book
  belongs_to :category

end
