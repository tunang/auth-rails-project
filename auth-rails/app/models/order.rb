class Order < ApplicationRecord
  belongs_to :user
  # belongs_to :shipping_address, class_name: 'Address' #Only get address that not soft deleted
  belongs_to :shipping_address, -> { with_deleted }, class_name: 'Address' #Get all address even soft deleted

  has_many :order_items, dependent: :destroy
  has_many :books, through: :order_items

  validates :status, presence: true
  validates :total_amount, presence: true, numericality: { greater_than: 0 }

  enum :status, {
    pending: 0, 
    confirmed: 1, 
    processing: 2, 
    shipped: 3, 
    delivered: 4, 
    cancelled: 5, 
    refunded: 6 
  }

  before_create :generate_order_number

  private

  def generate_order_number
    self.order_number = "ORD#{Time.current.strftime('%Y%m%d')}#{SecureRandom.hex(4).upcase}"
  end
end