import type { AppDispatch } from "@/store";
import cable from "../../cable";
import { toast } from "sonner";
import { addOrder } from "@/store/slices/orderSlice";

export const subscribeAdminOrdersChannel = (dispatch: AppDispatch) => {
  const channel = cable.subscriptions.create("Admin::OrderChannel", {
    connected: () => {
      console.log("Connected to AdminOrdersChannel");
    },
    disconnected: () => {
      console.log("Disconnected from AdminOrdersChannel");
    },
    received: (data: { type: string; payload: any }) => {
      console.log("Order event received:", data);
      switch (data.type) {
        case "ORDER_CREATED":
          dispatch(addOrder(data.payload));
          break;
        case "connect":
          toast.success("Đã kết nối với WebSocket");
          break;
        default:
          break;
      }
    },
  });

  return channel;
};
