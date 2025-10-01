import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useDispatch, useSelector } from "react-redux";
import { getUsersRequest, setPerPage } from "@/store/slices/userSlice";
import React, { useCallback, useEffect, useState } from "react";
import type { RootState } from "@/store";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UsersPage = () => {
  const header = "Người dùng";
  const dispatch = useDispatch();
  const [searchParam, setSearchParam] = React.useState("");
  const [searchInput, setSearchInput] = useState(searchParam);

  const {
    users: data,
    pagination,
    perPage,
  } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(
      getUsersRequest({ page: 1, per_page: perPage, search: searchParam })
    );
  }, [dispatch, perPage, searchParam]);

  const handlePageChange = (page: number) => {
    dispatch(
      getUsersRequest({ page, per_page: perPage, search: searchParam })
    );
  };

  const handlePerPageChange = (newPerPage: number) => {
    dispatch(setPerPage(newPerPage));
    dispatch(
      getUsersRequest({
        page: 1,
        per_page: newPerPage,
        search: searchParam,
      })
    );
  };

  const handleSearchParamChange = (search: string) => {
    setSearchParam(search);
    dispatch(getUsersRequest({ page: 1, per_page: perPage, search }));
  };

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
          </div>

          <div className="flex justify-between py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tìm kiếm người dùng..."
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
          header="Users"
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

export default UsersPage;
