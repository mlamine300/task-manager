export interface User {
  name: string;
  email: string;
  profileImageUrl?: string;
  password?: string;
  role?: string;
  token?: string;
  createdAt?: Date;
}
export interface TaskLine {
  _id: string;
  status: "Pending" | "Completed" | "In Progress";
  title: string;
  priority: "Low" | "Medium" | "High";
  createdAt: Date;
}
