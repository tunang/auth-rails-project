import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useDispatch, useSelector } from "react-redux";
import { getAddressesRequest, clearMessage } from "@/store/slices/addressSlice";
import React, { useEffect } from "react";
import type { RootState } from "@/store";
import { toast } from "sonner";
import CreateAddressModal from "./modal/create-address-modal";
import { MapPin, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="min-h-screen bg-amber-50/30">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-amber-700">Đang tải địa chỉ...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
           
          </div>

          <nav className="flex items-center space-x-2 text-sm text-amber-600">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/")}
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-1"
            >
              <Home className="h-4 w-4 mr-1" />
              Trang chủ
            </Button>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-amber-800">Địa chỉ</span>
          </nav>
        </div>

        {data.length === 0 && !isLoading ? (
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardContent className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-amber-800 mb-2">Chưa có địa chỉ nào</h3>
              <p className="text-amber-600 mb-6">Thêm địa chỉ để thuận tiện cho việc giao hàng</p>
              <CreateAddressModal />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-amber-800">Danh sách địa chỉ</CardTitle>
              <CreateAddressModal />
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={data} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddressPage;