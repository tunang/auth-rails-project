# config/initializers/constants.rb

module AppConstants
  module Order
    TAX_RATE = 0.1
    SHIPPING_COST = 5
    PAYMENT_STATUS = {
      pending: 'pending',
      paid: 'paid',
      failed: 'failed',
    }.freeze
  end

  module Cleanup
    HARD_DELETE_AFTER = 1.week
  end
end
