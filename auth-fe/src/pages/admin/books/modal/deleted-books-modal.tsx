import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { 
  getDeletedBooksRequest, 
  restoreBookRequest
} from "@/store/slices/bookSlice";
import type { Book } from "@/types/book.type";
import type { PaginationParams } from "@/types";
import { Trash2, RotateCcw, BookOpen, Calendar, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const DeletedBooksModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();
  const { deletedBooks, isLoadingDeleted, deletedPagination, isLoading, message } = useAppSelector(
    (state) => state.book
  );

  const loadDeletedBooks = (page: number = 1) => {
    const params: PaginationParams = {
      page,
      per_page: 10,
    };

    dispatch(getDeletedBooksRequest(params));
  };

  const handleRestoreBook = (bookId: number, title: string) => {
    dispatch(restoreBookRequest(bookId));
  };

  useEffect(() => {
    if (isOpen) {
      loadDeletedBooks(1);
      setCurrentPage(1);
    }
  }, [isOpen]);

  // Handle success/error messages from redux store
  useEffect(() => {
    if (message === "Book restored successfully") {
      toast.success("Đã khôi phục sách thành công");
      // Reload deleted books list after successful restore
      loadDeletedBooks(currentPage);
    }
  }, [message, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadDeletedBooks(page);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="w-4 h-4 mr-2" />
          Sách đã xóa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sách đã xóa</DialogTitle>
          <DialogDescription>
            Danh sách các sách đã bị xóa tạm thời. Bạn có thể khôi phục lại các sách này.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoadingDeleted ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : deletedBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-500 mb-2">
                Không có sách nào đã bị xóa
              </p>
              <p className="text-sm text-gray-400">
                Các sách đã xóa sẽ hiển thị ở đây
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {deletedBooks.map((book: Book) => (
                <div
                  key={book.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-16 h-20 bg-gray-100 rounded border flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
                            {book.title}
                          </h3>
                          
                          {book.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {book.description}
                            </p>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-green-600">
                                {formatPrice(book.price)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Tồn kho:</span>
                              <span className="font-medium">{book.stock_quantity}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Giảm giá:</span>
                              <span className="font-medium">{book.discount_percentage}%</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {formatDate(book.updated_at)}
                              </span>
                            </div>
                          </div>
                          
                          {book.authors && book.authors.length > 0 && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">Tác giả: </span>
                              <span className="text-sm font-medium">
                                {book.authors.map(author => author.name).join(", ")}
                              </span>
                            </div>
                          )}
                          
                          {book.categories && book.categories.length > 0 && (
                            <div className="mt-1">
                              <span className="text-sm text-gray-500">Thể loại: </span>
                              <span className="text-sm">
                                {book.categories.map(category => category.name).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <Button
                        onClick={() => handleRestoreBook(book.id, book.title)}
                        disabled={isLoading}
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {isLoading ? "Đang khôi phục..." : "Khôi phục"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {deletedPagination.total_pages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoadingDeleted}
              >
                Trước
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, deletedPagination.total_pages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoadingDeleted}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === deletedPagination.total_pages || isLoadingDeleted}
              >
                Sau
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletedBooksModal;