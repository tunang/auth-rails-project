import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesRequest, setPerPage } from "@/store/slices/categorySlice";
import React, { useCallback, useEffect, useState } from "react";
import type { RootState } from "@/store";
import { toast } from "sonner";
import CreateCategoryModal from "./modal/create-category-modal";
import DeletedCategoriesModal from "./modal/deleted-categories-modal";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const CategoriesPage = () => {
  const header = "Danh mục";
  const dispatch = useDispatch();
  const [searchParam, setSearchParam] = React.useState("");
  const [searchInput, setSearchInput] = useState(searchParam);

  const {
    categories: data,
    pagination,
    message,
    perPage,
  } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    dispatch(
      getCategoriesRequest({ page: 1, per_page: perPage, search: searchParam })
    );
  }, [dispatch, perPage, searchParam]);

  const handlePageChange = (page: number) => {
    dispatch(
      getCategoriesRequest({ page, per_page: perPage, search: searchParam })
    );
  };

  const handlePerPageChange = (newPerPage: number) => {
    dispatch(setPerPage(newPerPage));
    dispatch(
      getCategoriesRequest({
        page: 1,
        per_page: newPerPage,
        search: searchParam,
      })
    );
  };

  const handleSearchParamChange = (search: string) => {
    setSearchParam(search);
    dispatch(getCategoriesRequest({ page: 1, per_page: perPage, search }));
  };

  React.useEffect(() => {
    if (message === "category_created_successfully") {
      toast.success("Thêm danh mục thành công");
    }

    if (message === "category_updated_successfully") {
      toast.success("Cập nhật danh mục thành công");
    }

    if (message === "category_deleted_successfully") {
      toast.success("Xóa danh mục thành công");
    }

    if (message === "validation_error") {
      toast.error("Thêm danh mục thất bại, tên danh mục đã tồn tại");
    }

    if (message === "update_category_failure") {
      toast.error("Cập nhật danh mục thất bại");
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
              <CreateCategoryModal />
              <DeletedCategoriesModal />
            </div>
          </div>

          <div className="flex justify-between py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search categories..."
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);
                  debouncedSearch(value);
                }}
              />
              <Button>
                <Search /> Search
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
          header="Categories"
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

export default CategoriesPage;
