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
  data: T;
  status: {
    code: number;
    message: string;
  };
  errors?: {
    [key: string]: string[];
  };
  meta?: {
    current_page: number;
    next_page: number;
    prev_page: number;
    total_pages: number;
    total_count: number;
  };
};