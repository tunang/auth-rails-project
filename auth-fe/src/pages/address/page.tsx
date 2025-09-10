import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useDispatch, useSelector } from "react-redux";
import { getAddressesRequest, clearMessage } from "@/store/slices/addressSlice";
import React, { useEffect } from "react";
import type { RootState } from "@/store";
import { toast } from "sonner";
import CreateAddressModal from "./modal/create-address-modal";
import { MapPin } from "lucide-react";

const AddressPage = () => {
  const header = "Địa chỉ của tôi";
  const dispatch = useDispatch();

  const {
    addresses: data,
    message,
    isLoading,
  } = useSelector((state: RootState) => state.address);

  useEffect(() => {
    dispatch(getAddressesRequest());
  }, [dispatch]);

  React.useEffect(() => {
    if (message) {
      if (message.includes("successfully") || message.includes("thành công")) {
        toast.success(message);
      } else {
        toast.error(message);
      }
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  if (isLoading && data.length === 0) {
    return (
      <div className="container mx-auto pt-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải địa chỉ...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <div>
        <div>
          <div className="flex justify-between items-center border-b border-gray-200 gap-4 pb-2">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">{header}</h1>
            </div>
            <div className="flex gap-2">
              <CreateAddressModal />
            </div>
          </div>

          {data.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có địa chỉ nào
              </h3>
              <p className="text-gray-500 mb-4">
                Thêm địa chỉ để thuận tiện cho việc giao hàng
              </p>
              <CreateAddressModal />
            </div>
          ) : (
            <div className="mt-4">
              <DataTable
                columns={columns}
                data={data}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressPage;