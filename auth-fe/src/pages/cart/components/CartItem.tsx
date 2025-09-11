import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItemRequest, removeFromCartRequest, toggleItemSelection } from "@/store/slices/cartSlice";
import type { CartItem as CartItemType } from "@/types/cart.type";
import type { RootState } from "@/store";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const { selectedItems } = useSelector((state: RootState) => state.cart);
  const { book } = item;
  const isSelected = selectedItems.includes(book.id);
  const price = parseFloat(book.price);
  const discountPercentage = parseFloat(book.discount_percentage);
  const discountedPrice = price * (1 - discountPercentage / 100);
  const totalPrice = discountedPrice * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    setQuantity(newQuantity);
    setIsUpdating(true);
    
    dispatch(updateCartItemRequest({
      book_id: book.id,
      quantity: newQuantity
    }));
    
    setTimeout(() => setIsUpdating(false), 1000);
  };

  const handleRemoveItem = () => {
    dispatch(removeFromCartRequest({ book_id: book.id }));
  };

  const handleToggleSelection = () => {
    dispatch(toggleItemSelection(book.id));
  };

  return (
    <Card className={`mb-4 transition-colors ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Checkbox */}
          <div className="flex-shrink-0 pt-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleToggleSelection}
            />
          </div>

          {/* Book Image */}
          <div className="flex-shrink-0">
            <img
              src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${book.cover_image_url}`}
              alt={book.title}
              className="w-20 h-28 object-cover rounded"
            />
          </div>

          {/* Book Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {book.description}
                </p>
                
                {/* Authors */}
                {book.authors.length > 0 && (
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">Tác giả: </span>
                    {book.authors.map((author, index) => (
                      <span key={author.id} className="text-sm">
                        {author.name}
                        {index < book.authors.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                )}

                {/* Categories */}
                {book.categories.length > 0 && (
                  <div className="mb-2">
                    {book.categories.map((category) => (
                      <Badge key={category.id} variant="secondary" className="mr-1">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Stock Status */}
                <div className="mb-2">
                  {book.stock_quantity > 0 ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Còn {book.stock_quantity} sản phẩm
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      Hết hàng
                    </Badge>
                  )}
                </div>
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveItem}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Price and Quantity */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Số lượng:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isUpdating}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <Input
                    type="number"
                    min="1"
                    max="99"
                    value={quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value) || 1;
                      handleQuantityChange(newQuantity);
                    }}
                    className="w-16 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                    disabled={isUpdating}
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 99 || quantity >= book.stock_quantity || isUpdating}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                {isUpdating && (
                  <span className="text-sm text-gray-500">Đang cập nhật...</span>
                )}
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  {discountPercentage > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      {(price * quantity).toLocaleString('vi-VN')}đ
                    </span>
                  )}
                  <span className="font-semibold text-lg">
                    {totalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                {discountPercentage > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;