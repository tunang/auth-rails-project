import { useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
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
      <Card>
        <CardContent className="p-6 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Giỏ hàng trống
          </h3>
          <p className="text-gray-500 mb-4">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Button onClick={() => window.history.back()}>
            Tiếp tục mua sắm
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Tóm tắt đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Select All Checkbox */}
        <div className="flex items-center space-x-2 pb-2 border-b">
          <Checkbox
            checked={allItemsSelected}
            ref={(ref) => {
              if (ref) {
                ref.indeterminate = someItemsSelected;
              }
            }}
            onCheckedChange={handleSelectAll}
          />
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Chọn tất cả ({selectedItems.length}/{items.length})
          </label>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Sản phẩm đã chọn:</span>
          <span className="font-medium">{selectedTotalItems}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tạm tính:</span>
          <span className="font-medium">
            {selectedTotalAmount.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Phí vận chuyển:</span>
          <span className="font-medium text-green-600">Miễn phí</span>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="font-semibold">Tổng cộng:</span>
          <span className="font-bold text-lg text-primary">
            {selectedTotalAmount.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="space-y-2">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleCheckout}
            disabled={isLoading || selectedItems.length === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {selectedItems.length === 0 ? 'Chọn sản phẩm để thanh toán' : 'Thanh toán'}
          </Button>

          <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa tất cả
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Xác nhận xóa giỏ hàng</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng? 
                  Hành động này không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowClearDialog(false)}
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

        <div className="text-xs text-gray-500 text-center mt-4">
          * Giá đã bao gồm VAT
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;