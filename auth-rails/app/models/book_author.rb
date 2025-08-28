class BookAuthor < ApplicationRecord
  acts_as_paranoid
  
  belongs_to :book
  belongs_to :author
end