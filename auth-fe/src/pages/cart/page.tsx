import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ShoppingBag, BookOpenIcon } from "lucide-react";
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
  }, []);



  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-amber-700 font-medium">Đang tải giỏ hàng...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-600 text-white p-2 rounded-lg shadow-md">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-800">Giỏ hàng của bạn</h1>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm text-amber-700 bg-amber-100 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-4 w-4" />
                <span className="font-medium">{totalItems} sản phẩm</span>
              </div>
              <div className="w-px h-4 bg-amber-300"></div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <CartSummary totalItems={0} totalAmount={0} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-amber-800">Sản phẩm trong giỏ hàng</h2>
                  <div className="text-sm text-amber-600">
                    {items.length} sản phẩm
                  </div>
                </div>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <CartItem key={`${item.book.id}-${index}`} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CartSummary 
                  totalItems={totalItems} 
                  totalAmount={totalAmount}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;