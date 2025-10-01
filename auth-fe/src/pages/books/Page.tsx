import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpenIcon, 
  ShoppingCartIcon, 
  UserIcon, 
  TagIcon, 
  HomeIcon, 
  ChevronRightIcon,
  StarIcon,
  CalendarIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  Minus,
  Plus,
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon
} from "lucide-react";

const BookDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const { selectedBook, isLoadingDetail, message } = useSelector(
    (state: RootState) => state.book
  );
  
  const { isLoading: isAddingToCart, message: cartMessage } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    if (slug) {
      dispatch(getBookDetailRequest(slug));
    }
  }, [dispatch, slug]);

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

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString('vi-VN') + 'đ';
  };

  const getDiscountedPrice = (price: number | string, discountPercentage: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numDiscount = typeof discountPercentage === 'string' ? parseFloat(discountPercentage) : discountPercentage;
    return numPrice * (1 - numDiscount / 100);
  };

  const getSavingsAmount = (price: number | string, discountPercentage: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numDiscount = typeof discountPercentage === 'string' ? parseFloat(discountPercentage) : discountPercentage;
    return numPrice - (numPrice * (1 - numDiscount / 100));
  };

  if (isLoadingDetail) {
    return (
      <div className="min-h-screen bg-amber-50/30">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
              </div>
            </div>
            <Skeleton className="h-6 w-48" />
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (message && !selectedBook) {
    return (
      <div className="min-h-screen bg-amber-50/30">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="text-center py-16">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <AlertCircleIcon className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-red-800 mb-4">Lỗi tải sách</h1>
            <p className="text-red-600 text-lg mb-6">{message}</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedBook) {
    return (
      <div className="min-h-screen bg-amber-50/30">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="text-center py-16">
            <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <BookOpenIcon className="h-10 w-10 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-amber-800 mb-4">Không tìm thấy sách</h1>
            <p className="text-amber-600 text-lg mb-6">Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
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
          {/* <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
           
          </div> */}
          
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-amber-600">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-1"
            >
              <HomeIcon className="h-4 w-4 mr-1" />
              Trang chủ
            </Button>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="font-medium text-amber-800">{selectedBook.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hình ảnh sách */}
          <div className="space-y-4">
            <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                {selectedBook.cover_image_url ? (
                  <img
                    src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${selectedBook.cover_image_url}`}
                    alt={selectedBook.title}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-amber-100 flex items-center justify-center">
                    <BookOpenIcon className="h-20 w-20 text-amber-400" />
                  </div>
                )}
                
                {/* Discount Badge */}
                {selectedBook.discount_percentage && parseFloat(selectedBook.discount_percentage.toString()) > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-lg">
                    -{selectedBook.discount_percentage}%
                  </div>
                )}

                {/* Featured Badge */}
                {selectedBook.featured && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                    <StarIcon className="h-4 w-4" />
                    Nổi bật
                  </div>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <HeartIcon className={`h-4 w-4 mr-2 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} />
                {isWishlisted ? 'Đã yêu thích' : 'Yêu thích'}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>

          {/* Thông tin sách */}
          <div className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-bold text-amber-800 mb-2">
                  {selectedBook.title}
                </CardTitle>
                {selectedBook.description && (
                  <CardDescription className="text-lg text-amber-600">
                    {selectedBook.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Giá và khuyến mãi */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-amber-700">
                      {formatPrice(getDiscountedPrice(selectedBook.price, selectedBook.discount_percentage || 0))}
                    </span>
                    {selectedBook.discount_percentage && parseFloat(selectedBook.discount_percentage.toString()) > 0 && (
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(selectedBook.price)}
                      </span>
                    )}
                  </div>
                  
                  {selectedBook.discount_percentage && parseFloat(selectedBook.discount_percentage.toString()) > 0 && (
                    <div className="text-sm text-amber-600 font-medium">
                      Tiết kiệm {formatPrice(getSavingsAmount(selectedBook.price, selectedBook.discount_percentage))}
                    </div>
                  )}
                </div>

                {/* Thông tin kho */}
                <div className="flex items-center gap-2">
                  {selectedBook.stock_quantity > 0 ? (
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700">
                        Còn {selectedBook.stock_quantity} sản phẩm
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircleIcon className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-600">Tạm hết hàng</span>
                    </div>
                  )}
                </div>

                {/* Thông báo cart message */}
                {cartMessage && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <span className="text-green-700 font-medium">{cartMessage}</span>
                    </div>
                  </div>
                )}

                {/* Chọn số lượng và thêm vào giỏ hàng */}
                {selectedBook.stock_quantity > 0 && (
                  <div className="space-y-4 p-6 bg-amber-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-800">Số lượng:</span>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400 h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-4 py-2 border border-amber-300 rounded-lg min-w-12 text-center font-semibold text-amber-800">
                          {quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= selectedBook.stock_quantity}
                          className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400 h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || selectedBook.stock_quantity <= 0}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
                    >
                      <ShoppingCartIcon className="mr-2 h-5 w-5" />
                      {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                    </Button>
                  </div>
                )}

                {/* Hết hàng */}
                {selectedBook.stock_quantity <= 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <AlertCircleIcon className="h-5 w-5 text-red-500" />
                      <span className="text-red-700 font-medium">Sản phẩm tạm hết hàng</span>
                    </div>
                  </div>
                )}

                {/* Tác giả */}
                {selectedBook.authors && selectedBook.authors.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-amber-600" />
                      <span className="font-semibold text-amber-800">Tác giả:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedBook.authors.map((author) => (
                        <Badge key={author.id} variant="outline" className="border-amber-300 text-amber-700">
                          {author.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Danh mục */}
                {selectedBook.categories && selectedBook.categories.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4 text-amber-600" />
                      <span className="font-semibold text-amber-800">Danh mục:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedBook.categories.map((category) => (
                        <Badge key={category.id} variant="outline" className="border-amber-300 text-amber-700">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ngày tạo và cập nhật */}
                <div className="space-y-2 pt-4 border-t border-amber-200">
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Ngày tạo: {new Date(selectedBook.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Cập nhật: {new Date(selectedBook.updated_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample pages nếu có */}
            {selectedBook.sample_page_urls && selectedBook.sample_page_urls.length > 0 && (
              <Card className="bg-white rounded-2xl shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-amber-800 flex items-center gap-2">
                    <BookOpenIcon className="h-5 w-5" />
                    Xem thử
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedBook.sample_page_urls.map((url, index) => (
                      <img
                        key={index}
                        src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${url}`}
                        alt={`Trang xem thử ${index + 1}`}
                        className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;