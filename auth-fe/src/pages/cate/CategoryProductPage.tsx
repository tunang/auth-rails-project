import { useEffect } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo, PerPageSelector } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getBooksByCategoryRequest, setPerPage as setBooksPerPage } from "@/store/slices/bookSlice";
import { useDispatch, useSelector } from "react-redux";
import { BookOpenIcon, ShoppingCartIcon, UserIcon, TagIcon, HomeIcon, ChevronRightIcon, FilterIcon, SortAscIcon } from "lucide-react";
import type { RootState } from "@/store";

const CategoryProductPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { books, isLoading, pagination, perPage } = useSelector((state: RootState) => state.book);
  const navigate = useNavigate(); 

  useEffect(() => {
    dispatch(getBooksByCategoryRequest({ categoryId: Number(id), params: { page: pagination.current_page || 1, per_page: perPage } }));
  }, [id, dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(getBooksByCategoryRequest({ categoryId: Number(id), params: { page, per_page: perPage } }));
  };

  const handlePerPageChange = (value: number) => {
    dispatch(setBooksPerPage(value));
    dispatch(getBooksByCategoryRequest({ categoryId: Number(id), params: { page: 1, per_page: value } }));
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString('vi-VN') + 'đ';
  };

  const getDiscountedPrice = (price: string | number, discountPercentage: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numDiscount = typeof discountPercentage === 'string' ? parseFloat(discountPercentage || '0') : discountPercentage;
    return numPrice * (1 - numDiscount / 100);
  };

  const getSavingsAmount = (price: string | number, discountPercentage: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numDiscount = typeof discountPercentage === 'string' ? parseFloat(discountPercentage || '0') : discountPercentage;
    return numPrice - (numPrice * (1 - numDiscount / 100));
  };

  if (isLoading) {
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
          
          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <Card key={index} className="overflow-hidden bg-white rounded-2xl shadow-lg">
                <Skeleton className="h-64 w-full rounded-t-2xl" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!books) {
    return (
      <div className="min-h-screen bg-amber-50/30">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="text-center py-16">
            <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <BookOpenIcon className="h-10 w-10 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-amber-800 mb-4">Danh mục không tồn tại</h1>
            <p className="text-amber-600 text-lg mb-6">Danh mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
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
            <span className="font-medium text-amber-800">Danh mục sản phẩm</span>
          </nav>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-amber-700">
              <FilterIcon className="h-4 w-4" />
              <span className="font-medium">Bộ lọc</span>
            </div>
            <div className="flex items-center gap-2 text-amber-700">
              <SortAscIcon className="h-4 w-4" />
              <span className="font-medium">Sắp xếp</span>
            </div>
          </div>
          
          <div className="text-sm text-amber-600">
            <span className="font-semibold">{books.length}</span> sản phẩm
          </div>
        </div>

        {/* Products Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <Card 
                key={book.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/book/${book.slug}`)}
              >
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${book.cover_image_url}`}
                    alt={book.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {book.discount_percentage && parseFloat(book.discount_percentage.toString()) > 0 && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold px-2 py-1">
                      -{book.discount_percentage}%
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <CardTitle className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 h-10 group-hover:text-amber-700 transition-colors">
                    {book.title}
                  </CardTitle>
                  
                  {/* Authors */}
                  <div className="mb-2 flex items-center gap-1">
                    <UserIcon className="h-3 w-3 text-amber-600" />
                    <CardDescription className="text-xs text-amber-600 truncate">
                      {book.authors.map((author) => author.name).join(", ")}
                    </CardDescription>
                  </div>

                  {/* Categories */}
                  {book.categories && book.categories.length > 0 && (
                    <div className="mb-3 flex items-center gap-1">
                      <TagIcon className="h-3 w-3 text-amber-600" />
                      <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                        {book.categories[0].name}
                      </Badge>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-amber-700">
                        {formatPrice(getDiscountedPrice(book.price, book.discount_percentage || '0'))}
                      </span>
                      {book.discount_percentage && parseFloat(book.discount_percentage.toString()) > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(book.price)}
                        </span>
                      )}
                    </div>
                    {book.discount_percentage && parseFloat(book.discount_percentage.toString()) > 0 && (
                      <div className="text-xs text-amber-600 font-medium">
                        Tiết kiệm {formatPrice(getSavingsAmount(book.price, book.discount_percentage))}
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle add to cart
                    }}
                  >
                    <ShoppingCartIcon className="mr-2 h-4 w-4" />
                    Thêm vào giỏ
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <BookOpenIcon className="h-10 w-10 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-amber-800 mb-4">
              Chưa có sản phẩm nào
            </h3>
            <p className="text-amber-600 text-lg mb-6">
              Danh mục này hiện tại chưa có sản phẩm nào. Vui lòng quay lại sau.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </div>
        )}
        {/* Pagination Controls */}
        {pagination.total_pages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <PaginationInfo
              currentPage={pagination.current_page}
              totalCount={pagination.total_count}
              perPage={perPage}
            />
            <div className="flex items-center gap-4">
              <PerPageSelector perPage={perPage} onPerPageChange={handlePerPageChange} />
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProductPage;