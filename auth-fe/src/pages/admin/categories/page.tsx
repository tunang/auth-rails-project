import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesRequest, setPerPage } from "@/store/slices/categorySlice";
import React from "react";
import type { RootState } from "@/store";
import { toast } from "sonner";

const CategoriesPage = () => {
  const dispatch = useDispatch();

  
  const { categories: data, pagination, message, perPage } = useSelector((state: RootState) => state.category);
  React.useEffect(() => {
    dispatch(getCategoriesRequest({ page: 1, per_page: perPage }));
  }, [dispatch, perPage]);

  const handlePageChange = (page: number) => {
    dispatch(getCategoriesRequest({ page, per_page: perPage }));
  };

  const handlePerPageChange = (newPerPage: number) => {
    dispatch(setPerPage(newPerPage));
    dispatch(getCategoriesRequest({ page: 1, per_page: newPerPage }));
  };

  React.useEffect(() => {
    if (message === "category_created_successfully") {
      toast.success("Thêm danh mục thành công");
    }

    if (message === "update_category_success") {
      toast.success("Cập nhật danh mục thành công");
    }

    if (message === "delete_category_success") {
      toast.success("Xóa danh mục thành công");
    }

    if (message === "validation_error") {
      toast.error("Thêm danh mục thất bại, tên danh mục đã tồn tại");
    }

    if (message === "update_category_failure") {
      toast.error("Cập nhật danh mục thất bại");
    }
  }, [message]);


  return (
    <div className="container mx-auto py-10">
      <div>
        <DataTable 
          columns={columns} 
          data={data} 
          header="Categories" 
          pagination={pagination}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      </div>
    </div>
  );
};

export default CategoriesPage;
