export const Role = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type Role = typeof Role[keyof typeof Role];

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
}

export type ApiResponse<T> = {
  data: T | null;
  status: {
    code: number;
    message: string;
  };
  errors?: string[];
  pagination?: Pagination;
};

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