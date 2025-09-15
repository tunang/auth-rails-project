import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersRequest, setPerPage } from "@/store/slices/orderSlice";
import React, { useCallback, useEffect, useState } from "react";
import type { RootState } from "@/store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { subscribeAdminOrdersChannel } from "@/lib/cable/admin/order/cable";
import type { AppDispatch } from "@/store";

const OrdersPage = () => {
  const header = "Đơn hàng";
  const dispatch = useDispatch() as AppDispatch;
  const [searchParam, setSearchParam] = React.useState("");
  const [searchInput, setSearchInput] = useState(searchParam);

  const {
    orders: data,
    pagination,
    message,
    perPage,
  } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    dispatch(
      getOrdersRequest({ page: 1, per_page: perPage, search: searchParam })
    );
  }, [dispatch, perPage, searchParam]);

  useEffect(() => {
    const channel = subscribeAdminOrdersChannel(dispatch);
    return () => {
      channel.unsubscribe();
    };
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(
      getOrdersRequest({ page, per_page: perPage, search: searchParam })
    );
  };

  const handlePerPageChange = (newPerPage: number) => {
    dispatch(setPerPage(newPerPage));
    dispatch(
      getOrdersRequest({
        page: 1,
        per_page: newPerPage,
        search: searchParam,
      })
    );
  };

  const handleSearchParamChange = (search: string) => {
    setSearchParam(search);
    dispatch(getOrdersRequest({ page: 1, per_page: perPage, search }));
  };

  React.useEffect(() => {
    if (message === "order_status_updated_successfully") {
      toast.success("Cập nhật trạng thái đơn hàng thành công");
    }

    if (message === "update_order_status_failure") {
      toast.error("Cập nhật trạng thái đơn hàng thất bại");
    }

    if (message === "validation_error") {
      toast.error("Dữ liệu không hợp lệ, vui lòng kiểm tra lại");
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
            {/* No create/delete buttons for orders as admin can only view and update status */}
          </div>

          <div className="flex justify-between py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tìm kiếm đơn hàng (theo mã đơn, tên khách hàng)..."
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);
                  debouncedSearch(value);
                }}
                className="w-80"
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
          header="Orders"
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

export default OrdersPage;