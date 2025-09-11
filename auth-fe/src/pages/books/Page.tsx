import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import type { RootState } from "@/store";
import { getBookDetailRequest } from "@/store/slices/bookSlice";
import { addToCartRequest, clearMessage } from "@/store/slices/cartSlice";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BookDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  
  const { selectedBook, isLoadingDetail, message } = useSelector(
    (state: RootState) => state.book
  );
  
  const { isLoading: isAddingToCart, message: cartMessage } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    if (id) {
      dispatch(getBookDetailRequest(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (cartMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cartMessage, dispatch]);

  const handleAddToCart = () => {
    if (selectedBook && quantity > 0) {
      dispatch(addToCartRequest({
        book_id: selectedBook.id,
        quantity: quantity
      }));
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (selectedBook?.stock_quantity || 99)) {
      setQuantity(newQuantity);
    }
  };

  if (isLoadingDetail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Đang tải thông tin sách...</div>
      </div>
    );
  }

  if (message && !selectedBook) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-500">Lỗi: {message}</div>
      </div>
    );
  }

  if (!selectedBook) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Không tìm thấy sách</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hình ảnh sách */}
        <div className="flex items-center justify-center">
          {selectedBook.cover_image_url ? (
            <img
              src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${selectedBook.cover_image_url}`}
              alt={selectedBook.title}
              className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-64 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Không có hình ảnh</span>
            </div>
          )}
        </div>

        {/* Thông tin sách */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl lg:text-3xl">
                {selectedBook.title}
              </CardTitle>
              {selectedBook.description && (
                <CardDescription className="text-base">
                  {selectedBook.description}
                </CardDescription>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Giá và khuyến mãi */}
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-primary">
                  {Number(selectedBook.price).toLocaleString('vi-VN')}₫
                </div>
                {selectedBook.discount_percentage > 0 && (
                  <Badge variant="destructive">
                    Giảm {selectedBook.discount_percentage}%
                  </Badge>
                )}
              </div>

              {/* Thông tin kho */}
              <div className="flex items-center gap-2">
                <span className="font-medium">Tồn kho:</span>
                <Badge variant={selectedBook.stock_quantity > 0 ? "default" : "destructive"}>
                  {selectedBook.stock_quantity} sản phẩm
                </Badge>
              </div>

              {/* Thông báo cart message */}
              {cartMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-green-700 text-sm">{cartMessage}</span>
                </div>
              )}

              {/* Chọn số lượng và thêm vào giỏ hàng */}
              {selectedBook.stock_quantity > 0 && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Số lượng:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="px-3 py-1 border rounded min-w-12 text-center">
                        {quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= selectedBook.stock_quantity}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || selectedBook.stock_quantity <= 0}
                    className="w-full"
                  >
                    {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                  </Button>
                </div>
              )}

              {/* Hết hàng */}
              {selectedBook.stock_quantity <= 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-red-700 font-medium">Sản phẩm tạm hết hàng</span>
                </div>
              )}

              {/* Tác giả */}
              {selectedBook.authors && selectedBook.authors.length > 0 && (
                <div>
                  <span className="font-medium">Tác giả: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedBook.authors.map((author) => (
                      <Badge key={author.id} variant="secondary">
                        {author.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Danh mục */}
              {selectedBook.categories && selectedBook.categories.length > 0 && (
                <div>
                  <span className="font-medium">Danh mục: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedBook.categories.map((category) => (
                      <Badge key={category.id} variant="outline">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Trạng thái nổi bật */}
              {selectedBook.featured && (
                <div>
                  <Badge variant="default">Sách nổi bật</Badge>
                </div>
              )}

              {/* Ngày tạo và cập nhật */}
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Ngày tạo: {new Date(selectedBook.created_at).toLocaleDateString('vi-VN')}</div>
                <div>Cập nhật lần cuối: {new Date(selectedBook.updated_at).toLocaleDateString('vi-VN')}</div>
              </div>
            </CardContent>
          </Card>

          {/* Sample pages nếu có */}
          {selectedBook.sample_page_urls && selectedBook.sample_page_urls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Xem thử</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {selectedBook.sample_page_urls.map((url, index) => (
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${url}`}
                      alt={`Trang xem thử ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;