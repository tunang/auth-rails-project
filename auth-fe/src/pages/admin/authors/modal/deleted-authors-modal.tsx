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
  getDeletedAuthorsRequest, 
  restoreAuthorRequest
} from "@/store/slices/authorSlice";
import type { Author } from "@/types/author.type";
import type { PaginationParams } from "@/types";
import { Trash2, RotateCcw, User, Calendar, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const DeletedAuthorsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();
  const { deletedAuthors, isLoadingDeleted, deletedPagination, isLoading, message } = useAppSelector(
    (state) => state.author
  );

  const loadDeletedAuthors = (page: number = 1) => {
    const params: PaginationParams = {
      page,
      per_page: 10,
    };

    dispatch(getDeletedAuthorsRequest(params));
  };

  const handleRestoreAuthor = (authorId: number, name: string) => {
    dispatch(restoreAuthorRequest(authorId));
  };

  useEffect(() => {
    if (isOpen) {
      loadDeletedAuthors(1);
      setCurrentPage(1);
    }
  }, [isOpen]);

  // Handle success/error messages from redux store
  useEffect(() => {
    if (message === "Author restored successfully") {
      toast.success("Đã khôi phục tác giả thành công");
      // Reload deleted authors list after successful restore
      loadDeletedAuthors(currentPage);
    }
  }, [message, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadDeletedAuthors(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatBirthDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="w-4 h-4 mr-2" />
          Tác giả đã xóa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tác giả đã xóa</DialogTitle>
          <DialogDescription>
            Danh sách các tác giả đã bị xóa tạm thời. Bạn có thể khôi phục lại các tác giả này.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoadingDeleted ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : deletedAuthors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-500 mb-2">
                Không có tác giả nào đã bị xóa
              </p>
              <p className="text-sm text-gray-400">
                Các tác giả đã xóa sẽ hiển thị ở đây
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {deletedAuthors.map((author: Author) => (
                <div
                  key={author.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-full border flex items-center justify-center overflow-hidden">
                          {author.photo ? (
                            <img 
                              src={author.photo} 
                              alt={author.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : (
                            <User className="w-8 h-8 text-gray-400" />
                          )}
                          <User className="w-8 h-8 text-gray-400 hidden" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
                            {author.name}
                          </h3>
                          
                          {author.biography && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                              {author.biography}
                            </p>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">Quốc tịch:</span>
                              <span className="font-medium">{author.nationality}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">Sinh:</span>
                              <span className="font-medium">
                                {formatBirthDate(author.birth_date)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Xóa lúc:</span>
                              <span className="text-xs text-gray-500">
                                {formatDate(author.updated_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <Button
                        onClick={() => handleRestoreAuthor(author.id, author.name)}
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

export default DeletedAuthorsModal;