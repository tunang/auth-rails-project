import type { AppDispatch } from "@/store";
import cable from "../../cable";
import { toast } from "sonner";

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
        case "disconnect":
          toast.error("Đã ngắt kết nối với WebSocket");
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
