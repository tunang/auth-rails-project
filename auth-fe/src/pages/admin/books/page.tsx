import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useDispatch, useSelector } from "react-redux";
import { getBooksRequest, setPerPage } from "@/store/slices/bookSlice";
import React, { useCallback, useEffect, useState } from "react";
import type { RootState } from "@/store";
import { toast } from "sonner";
import CreateBookModal from "./modal/create-book-modal";
import { Button } from "@/components/ui/button";
import { Filter, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const BooksPage = () => {
  const header = "Sách";
  const dispatch = useDispatch();
  const [searchParam, setSearchParam] = React.useState("");
  const [searchInput, setSearchInput] = useState(searchParam);

  const {
    books: data,
    pagination,
    message,
    perPage,
  } = useSelector((state: RootState) => state.book);

  useEffect(() => {
    dispatch(
      getBooksRequest({ page: 1, per_page: perPage, search: searchParam })
    );
  }, [dispatch, perPage, searchParam]);

  const handlePageChange = (page: number) => {
    dispatch(
      getBooksRequest({ page, per_page: perPage, search: searchParam })
    );
  };

  const handlePerPageChange = (newPerPage: number) => {
    dispatch(setPerPage(newPerPage));
    dispatch(
      getBooksRequest({
        page: 1,
        per_page: newPerPage,
        search: searchParam,
      })
    );
  };

  const handleSearchParamChange = (search: string) => {
    setSearchParam(search);
    dispatch(getBooksRequest({ page: 1, per_page: perPage, search }));
  };

  React.useEffect(() => {
    if (message === "book_created_successfully") {
      toast.success("Thêm sách thành công");
    }

    if (message === "book_updated_successfully") {
      toast.success("Cập nhật sách thành công");
    }

    if (message === "book_deleted_successfully") {
      toast.success("Xóa sách thành công");
    }

    if (message === "validation_error") {
      toast.error("Thêm sách thất bại, vui lòng kiểm tra lại thông tin");
    }

    if (message === "update_book_failure") {
      toast.error("Cập nhật sách thất bại");
    }
  }, [message]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchTerm: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handleSearchParamChange(searchTerm);
        }, 300);
      };
    })(),
    [handleSearchParamChange]
  );

  return (
    <div className="container mx-auto py-10">
      <div>
        <div>
          <div className="flex justify-between items-center border-b border-gray-200 gap-4">
            <h1 className="text-2xl font-bold">{header}</h1>
            <div className="flex gap-2">
              <CreateBookModal />
              <Button>
                <Trash2 /> Thùng rác
              </Button>
            </div>
          </div>

          <div className="p-4 flex justify-between">
            <div className="flex gap-2">
              <Input
                placeholder="Tìm kiếm sách..."
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);
                  debouncedSearch(value);
                }}
              />
              <Button>
                <Search /> Tìm kiếm
              </Button>
            </div>

            <div className="flex gap-2">
              <Filter />
            </div>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={data}
          header="Books"
          pagination={pagination}
          perPage={perPage}
          searchParam={searchParam}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      </div>
    </div>
  );
};

export default BooksPage;