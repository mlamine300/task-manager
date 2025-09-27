export interface User {
  name: string;
  email: string;
  profileImageUrl?: string;
  password?: string;
  role?: string;
  token?: string;
  createdAt?: Date;
}
