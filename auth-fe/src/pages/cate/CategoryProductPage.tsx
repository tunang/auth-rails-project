import { useEffect, useState } from "react";
import {  useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getBooksByCategoryRequest } from "@/store/slices/bookSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";

interface Category {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  children: Category[];
}



const CategoryProductPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const { books, isLoading } = useSelector((state: RootState) => state.book);
  const navigate = useNavigate(); 
 
  useEffect(() => {
    dispatch(getBooksByCategoryRequest({ categoryId: Number(id), params: { page: 1, per_page: 10 } }));
  }, [id]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-96 mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!books) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Danh mục không tồn tại</h1>
        <p className="text-gray-600">Danh mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h1>
        <p className="text-gray-600 text-lg">{category.description}</p>
        <div className="flex items-center mt-4">
          <Badge variant="outline" className="mr-2">
            {books.length} sản phẩm
          </Badge>
          <span className="text-sm text-gray-500">
            Danh mục ID: {category.id}
          </span>
        </div>
      </div> */}

      {/* Breadcrumb */}
      {/* <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-red-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              Trang chủ
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{category.name}</span>
            </div>
          </li>
        </ol>
      </nav> */}

      {/* Products Grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <Card onClick={() => navigate(`/book/${book.id}`)} key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${book.cover_image_url}`}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
                {book.discount_percentage && (
                  <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                    -{book.discount_percentage}%
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <CardTitle className="text-sm font-medium line-clamp-2 mb-2 h-10">
                  {book.title}
                </CardTitle>
                <CardDescription className="text-xs text-gray-600 mb-2">
                  {book.authors.map((author) => author.name).join(", ")}
                </CardDescription>
                
    

                {/* Price */}
                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(book.price)}
                    </span>
                    {book.cost_price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(book.cost_price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Thêm vào giỏ hàng
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Chưa có sản phẩm nào
          </h3>
          <p className="text-gray-600">
            Danh mục này hiện tại chưa có sản phẩm nào. Vui lòng quay lại sau.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryProductPage;