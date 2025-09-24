import { useState, useEffect } from "react";
import { Minus, Plus, Trash2, BookOpenIcon, UserIcon, TagIcon, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItemRequest, removeFromCartRequest, toggleItemSelection, updateCartItemQuantity } from "@/store/slices/cartSlice";
import type { CartItem as CartItemType } from "@/types/cart.type";
import type { RootState } from "@/store";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const { selectedItems, isLoading } = useSelector((state: RootState) => state.cart);
  const { book } = item;
  const isSelected = selectedItems.includes(book.id);
  const price = parseFloat(book.price);
  const discountPercentage = parseFloat(book.discount_percentage);
  const discountedPrice = price * (1 - discountPercentage / 100);
  const totalPrice = discountedPrice * quantity;

  // Sync local quantity with Redux state when item changes
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  // Reset updating state when loading stops
  useEffect(() => {
    if (!isLoading && isUpdating) {
      setIsUpdating(false);
    }
  }, [isLoading, isUpdating]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    setQuantity(newQuantity);
    setIsUpdating(true);
    
    // Update Redux state immediately for better UX
    dispatch(updateCartItemQuantity({
      bookId: book.id,
      quantity: newQuantity
    }));
    
    // Send update request to server
    dispatch(updateCartItemRequest({
      book_id: book.id,
      quantity: newQuantity
    }));
  };

  const handleRemoveItem = () => {
    dispatch(removeFromCartRequest({ book_id: book.id }));
  };

  const handleToggleSelection = () => {
    dispatch(toggleItemSelection(book.id));
  };

  return (
    <Card className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 bg-amber-50/50' : 'bg-white hover:shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Checkbox */}
          <div className="flex-shrink-0 pt-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleToggleSelection}
              className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
            />
          </div>

          {/* Book Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${book.cover_image_url}`}
                alt={book.title}
                className="w-20 h-28 object-cover rounded-lg shadow-sm border border-amber-200"
              />
              {discountPercentage > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  -{discountPercentage}%
                </div>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{book.title}</h3>
                
                {/* Authors & Categories in one line */}
                <div className="flex items-center gap-3 mb-2 text-xs text-amber-600">
                  {book.authors.length > 0 && (
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3" />
                      <span className="truncate">
                        {book.authors.map(author => author.name).join(", ")}
                      </span>
                    </div>
                  )}
                  {book.categories.length > 0 && (
                    <div className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      <span className="truncate">
                        {book.categories[0].name}
                        {book.categories.length > 1 && ` +${book.categories.length - 1}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-2">
                  {book.stock_quantity > 0 ? (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">
                        Còn {book.stock_quantity} sản phẩm
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <AlertCircleIcon className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">Hết hàng</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveItem}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {/* Price and Quantity */}
            <div className="flex justify-between items-center pt-3 border-t border-amber-100">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-amber-700">Số lượng:</span>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isUpdating}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 h-7 w-7 p-0"
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
                    className="w-12 text-center border-amber-300 focus:border-amber-500 h-7 text-sm [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                    disabled={isUpdating}
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 99 || quantity >= book.stock_quantity || isUpdating}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 h-7 w-7 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                {isUpdating && (
                  <span className="text-xs text-amber-600 font-medium">Đang cập nhật...</span>
                )}
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  {discountPercentage > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      {(price * quantity).toLocaleString('vi-VN')}đ
                    </span>
                  )}
                  <span className="font-bold text-xl text-amber-700">
                    {totalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                {discountPercentage > 0 && (
                  <div className="text-xs text-amber-600 font-medium">
                    Tiết kiệm {((price - discountedPrice) * quantity).toLocaleString('vi-VN')}đ
                  </div>
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