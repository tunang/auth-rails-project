module CartItemRemoval
  extend ActiveSupport::Concern

  private

  def remove_items_from_cart(order_items_params)
    order_items_params.each do |item_params|
      book_id = item_params[:book_id] # or item_params["book_id"]
      quantity = item_params[:quantity]
      cart_item = current_user.cart_items.find_by(book_id: book_id)
      next unless cart_item

      if cart_item.quantity > quantity.to_i
        cart_item.update(quantity: cart_item.quantity - quantity.to_i)
      else
        cart_item.destroy
      end
    end
  end
end
