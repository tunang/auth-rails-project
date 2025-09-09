import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { getCartItemsRequest, clearMessage } from "@/store/slices/cartSlice";
import type { RootState } from "@/store";
import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSummary";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading, message, totalItems, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    dispatch(getCartItemsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      if (message.includes("successfully") || message.includes("thành công")) {
        toast.success(message);
      } else {
        toast.error(message);
      }
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  if (isLoading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
      </div>

      {items.length === 0 ? (
        <CartSummary totalItems={0} totalAmount={0} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item, index) => (
                <CartItem key={`${item.book.id}-${index}`} item={item} />
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary 
              totalItems={totalItems} 
              totalAmount={totalAmount}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;