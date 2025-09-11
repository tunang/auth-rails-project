export interface OrderUser {
  id: number;
  name: string;
  email: string;
}

export interface ShippingAddress {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderBook {
  id: number;
  title: string;
  price: string;
  cover_image_url: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  unit_price: string;
  total_price: string;
  book: OrderBook;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  subtotal: string;
  tax_amount: string;
  shipping_cost: string;
  total_amount: string;
  created_at: string;
  updated_at: string;
  user: OrderUser;
  shipping_address: ShippingAddress;
  order_items?: OrderItem[]; // Only available in detail view
}

export const OrderStatus = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: 5,
  REFUNDED: 6
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderStatusLabels = {
  [OrderStatus.PENDING]: "Chờ xác nhận",
  [OrderStatus.CONFIRMED]: "Đã xác nhận", 
  [OrderStatus.PROCESSING]: "Đang xử lý",
  [OrderStatus.SHIPPED]: "Đã gửi hàng",
  [OrderStatus.DELIVERED]: "Đã giao hàng",
  [OrderStatus.CANCELLED]: "Đã hủy",
  [OrderStatus.REFUNDED]: "Đã hoàn tiền",
  // String-based mapping for API response
  'pending': "Chờ xác nhận",
  'confirmed': "Đã xác nhận",
  'processing': "Đang xử lý", 
  'shipped': "Đã gửi hàng",
  'delivered': "Đã giao hàng",
  'cancelled': "Đã hủy",
  'refunded': "Đã hoàn tiền"
};

export const OrderStatusColors = {
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-800",
  [OrderStatus.PROCESSING]: "bg-purple-100 text-purple-800",
  [OrderStatus.SHIPPED]: "bg-indigo-100 text-indigo-800",
  [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
  [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
  [OrderStatus.REFUNDED]: "bg-gray-100 text-gray-800",
  // String-based mapping for API response
  'pending': "bg-yellow-100 text-yellow-800",
  'confirmed': "bg-blue-100 text-blue-800",
  'processing': "bg-purple-100 text-purple-800",
  'shipped': "bg-indigo-100 text-indigo-800", 
  'delivered': "bg-green-100 text-green-800",
  'cancelled': "bg-red-100 text-red-800",
  'refunded': "bg-gray-100 text-gray-800"
};

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface CreateOrderItem {
  quantity: number;
  book_id: number;
}

export interface CreateOrderRequest {
  shipping_address_id: number;
  payment_method: string;
  note?: string;
  order_items: CreateOrderItem[];
}

export interface CreateOrderResponse {
  status: {
    code: number;
    message: string;
  };
  data: Order;
  payment_url?: string;
}