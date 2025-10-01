export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserRoleLabels: Record<string, string> = {
  'admin': "Quản trị viên",
  'user': "Người dùng"
};

export const UserRoleColors: Record<string, string> = {
  'admin': "bg-purple-100 text-purple-800",
  'user': "bg-blue-100 text-blue-800"
};
