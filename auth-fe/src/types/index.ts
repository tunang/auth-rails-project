export const Role = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export type AuthResponse = {
  status: {
    code: number;
    message: string;
  };
  data: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  access_token: string;
  refresh_token: string;
};

export type BaseResponse = {
  status: {
    code: number;
    message: string;
  };
  errors?: string[];
};

// For single resource endpoints (data can be null if not found)
export type SingleResponse<T> = BaseResponse & {
  data: T | null;
};

// For list endpoints (data is always an array, never null)
export type ListResponse<T> = BaseResponse & {
  data: T[];
  pagination?: Pagination;
};

// export type ApiResponse<T> = {
//   data: T | T[] | null;
//   status: {
//     code: number;
//     message: string;
//   };
//   errors?: string[];
//   pagination?: Pagination;
// };

export type ErrorResponse = {
  status: {
    code: number;
    message: string;
  };
  errors: string[];
};

export type Pagination = {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
};

export type PaginationParams = {
  page?: number;
  per_page?: number;
  search?: string;
};
