import { AdminRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: AdminRole;
    isActive: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: AdminRole;
      isActive: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: AdminRole;
    isActive?: boolean;
  }
}
