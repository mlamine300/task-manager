import type { JwtPayload } from "jsonwebtoken";

export interface tokenPayload extends JwtPayload {
  userId: string;
  role: "admin" | "member";
}
