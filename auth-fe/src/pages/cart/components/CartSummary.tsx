import { useState } from "react";
import { ShoppingCart, Trash2, BookOpenIcon, CheckCircleIcon, TruckIcon, CreditCardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { clearCartRequest, selectAllItems, unselectAllItems } from "@/store/slices/cartSlice";
import type { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CartSummaryProps {
  totalItems: number;
  totalAmount: number;
  isLoading?: boolean;
}

const CartSummary = ({ totalItems, totalAmount, isLoading = false }: CartSummaryProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  const { selectedItems, selectedTotalItems, selectedTotalAmount, items } = useSelector(
    (state: RootState) => state.cart
  );
  
  const allItemsSelected = selectedItems.length === items.length && items.length > 0;
  const someItemsSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  const handleClearCart = () => {
    dispatch(clearCartRequest());
    setShowClearDialog(false);
  };

  const handleSelectAll = () => {
    if (allItemsSelected) {
      dispatch(unselectAllItems());
    } else {
      dispatch(selectAllItems());
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    navigate('/checkout');
  };

  if (totalItems === 0) {
    return (
      <Card className="bg-white rounded-2xl shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-amber-800 mb-3">
            Giỏ hàng trống
          </h3>
          <p className="text-amber-600 mb-6 text-lg">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-semibold"
          >
            Tiếp tục mua sắm
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4 bg-white rounded-2xl shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-amber-800 flex items-center gap-2">
          <BookOpenIcon className="h-5 w-5" />
          Tóm tắt đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Select All Checkbox */}
        <div className="flex items-center space-x-3 pb-4 border-b border-amber-100">
          <Checkbox
            checked={allItemsSelected}
            ref={(ref) => {
              if (ref) {
                ref.indeterminate = someItemsSelected;
              }
            }}
            onCheckedChange={handleSelectAll}
            className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
          />
          <label className="text-sm font-semibold text-amber-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Chọn tất cả ({selectedItems.length}/{items.length})
          </label>
        </div>

        {/* Order Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-amber-600 flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4" />
              Sản phẩm đã chọn:
            </span>
            <span className="font-bold text-amber-800">{selectedTotalItems}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-amber-600">Tạm tính:</span>
            <span className="font-semibold text-lg text-amber-700">
              {selectedTotalAmount.toLocaleString('vi-VN')}đ
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-amber-600 flex items-center gap-2">
              <TruckIcon className="h-4 w-4" />
              Phí vận chuyển:
            </span>
            <span className="font-semibold text-green-600">Miễn phí</span>
          </div>
        </div>

        <Separator className="bg-amber-200" />

        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-amber-800">Tổng cộng:</span>
          <span className="font-bold text-2xl text-amber-700">
            {selectedTotalAmount.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="space-y-3">
          <Button 
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg" 
            size="lg"
            onClick={handleCheckout}
            disabled={isLoading || selectedItems.length === 0}
          >
            <CreditCardIcon className="mr-2 h-5 w-5" />
            {selectedItems.length === 0 ? 'Chọn sản phẩm để thanh toán' : 'Thanh toán ngay'}
          </Button>

          <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 py-3 rounded-xl font-semibold"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa tất cả
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-amber-800">Xác nhận xóa giỏ hàng</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng? 
                  Hành động này không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowClearDialog(false)}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleClearCart}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Xóa tất cả
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-xs text-amber-600 text-center mt-4 bg-amber-50 p-3 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <CheckCircleIcon className="h-3 w-3" />
            <span>Giá đã bao gồm VAT</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;