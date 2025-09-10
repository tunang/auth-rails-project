import { z } from "zod";

export const addressSchema = z.object({
  first_name: z
    .string()
    .min(1, "Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự"),
  last_name: z
    .string()
    .min(1, "Họ là bắt buộc")
    .min(2, "Họ phải có ít nhất 2 ký tự")
    .max(50, "Họ không được quá 50 ký tự"),
  phone: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(/^[0-9+\-\s()]+$/, "Số điện thoại không hợp lệ")
    .min(10, "Số điện thoại phải có ít nhất 10 ký tự")
    .max(15, "Số điện thoại không được quá 15 ký tự"),
  address_line_1: z
    .string()
    .min(1, "Địa chỉ là bắt buộc")
    .max(200, "Địa chỉ không được quá 200 ký tự"),
  address_line_2: z
    .string()
    .max(200, "Địa chỉ không được quá 200 ký tự")
    .optional(),
  city: z
    .string()
    .min(1, "Thành phố là bắt buộc")
    .max(100, "Tên thành phố không được quá 100 ký tự"),
  state: z
    .string()
    .min(1, "Tỉnh/Thành là bắt buộc")
    .max(100, "Tên tỉnh/thành không được quá 100 ký tự"),
  postal_code: z
    .string()
    .min(1, "Mã bưu điện là bắt buộc")
    .max(20, "Mã bưu điện không được quá 20 ký tự"),
  country: z
    .string()
    .min(1, "Quốc gia là bắt buộc")
    .max(100, "Tên quốc gia không được quá 100 ký tự"),
  is_default: z
    .boolean()
    .default(false),
});

export const createAddressSchema = addressSchema;
export const updateAddressSchema = addressSchema.extend({
  id: z.number().positive("ID địa chỉ không hợp lệ"),
});

export type CreateAddressRequest = z.infer<typeof createAddressSchema>;
export type UpdateAddressRequest = z.infer<typeof updateAddressSchema>;