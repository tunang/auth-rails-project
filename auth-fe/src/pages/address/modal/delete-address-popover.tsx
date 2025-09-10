import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { deleteAddressRequest } from "@/store/slices/addressSlice";
import type { RootState } from "@/store";
import type { Address } from "@/types/address.type";

interface DeleteAddressPopoverProps {
  address: Address;
}

const DeleteAddressPopover = ({ address }: DeleteAddressPopoverProps) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.address);

  const handleDelete = () => {
    dispatch(deleteAddressRequest(address.id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
          Xóa
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Xác nhận xóa địa chỉ</h4>
            <p className="text-sm text-gray-600 mt-1">
              Bạn có chắc chắn muốn xóa địa chỉ này không?
            </p>
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium">
                {address.first_name} {address.last_name}
              </p>
              <p className="text-sm text-gray-600">{address.phone}</p>
              <p className="text-sm text-gray-600">
                {address.address_line_1}
                {address.address_line_2 && `, ${address.address_line_2}`}
              </p>
              <p className="text-sm text-gray-600">
                {address.city}, {address.state}, {address.country}
              </p>
            </div>
            <p className="text-xs text-red-600 mt-2">
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                // Close popover by clicking outside or using escape
                document.body.click();
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Đang xóa..." : "Xóa"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteAddressPopover;