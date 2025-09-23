import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useDispatch, useSelector } from "react-redux";
import { getAuthorsRequest, setPerPage } from "@/store/slices/authorSlice";
import React, { useCallback, useEffect, useState } from "react";
import type { RootState } from "@/store";
import { toast } from "sonner";
import CreateAuthorModal from "./modal/create-author-modal";
import DeletedAuthorsModal from "./modal/deleted-authors-modal";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const AuthorsPage = () => {
  const header = "Tác giả";
  const dispatch = useDispatch();
  const [searchParam, setSearchParam] = React.useState("");
  const [searchInput, setSearchInput] = useState(searchParam);

  const {
    authors: data,
    pagination,
    message,
    perPage,
  } = useSelector((state: RootState) => state.author);

  useEffect(() => {
    dispatch(
      getAuthorsRequest({ page: 1, per_page: perPage, search: searchParam })
    );
  }, [dispatch, perPage, searchParam]);

  const handlePageChange = (page: number) => {
    dispatch(
      getAuthorsRequest({ page, per_page: perPage, search: searchParam })
    );
  };

  const handlePerPageChange = (newPerPage: number) => {
    dispatch(setPerPage(newPerPage));
    dispatch(
      getAuthorsRequest({
        page: 1,
        per_page: newPerPage,
        search: searchParam,
      })
    );
  };

  const handleSearchParamChange = (search: string) => {
    setSearchParam(search);
    dispatch(getAuthorsRequest({ page: 1, per_page: perPage, search }));
  };

  React.useEffect(() => {
    if (message === "author_created_successfully") {
      toast.success("Thêm tác giả thành công");
    }

    if (message === "author_updated_successfully") {
      toast.success("Cập nhật tác giả thành công");
    }

    if (message === "author_deleted_successfully") {
      toast.success("Xóa tác giả thành công");
    }

    if (message === "validation_error") {
      toast.error("Thêm tác giả thất bại, vui lòng kiểm tra lại thông tin");
    }

    if (message === "update_author_failure") {
      toast.error("Cập nhật tác giả thất bại");
    }
  }, [message]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (function() {
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
    <div className="container mx-auto pt-4">
      <div>
        <div>
          <div className="flex justify-between items-center border-b border-gray-200 gap-4 pb-2">
            <h1 className="text-2xl font-bold">{header}</h1>
            <div className="flex gap-2">
              <CreateAuthorModal />
              <DeletedAuthorsModal />
            </div>
          </div>

          <div className="flex justify-between py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tìm kiếm tác giả..."
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
          header="Authors"
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

export default AuthorsPage;