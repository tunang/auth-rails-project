import { columns } from "./columns";
import { DataTable } from "./data-table";
import { type Category } from "@/types/category.type";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesRequest } from "@/store/slices/categorySlice";
import React from "react";
import type { RootState } from "@/store";

const CategoriesPage = () => {
  const dispatch = useDispatch();

  const { categories: data, pagination, isLoading, message } = useSelector((state: RootState) => state.category);
  React.useEffect(() => {
    dispatch(getCategoriesRequest());
  }, [dispatch]);

  const sampleData: Category[] = [
    {
      id: 1,
      name: "Category 1",
      description: "Description 1",
      parent: null,
      children: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Category 2",
      description: "Description 2",
      parent: null,
      children: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div>
        <DataTable columns={columns} data={data} header="Categories" />
      </div>
    </div>
  );
};

export default CategoriesPage;
