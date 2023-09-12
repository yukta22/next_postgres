// nextauth.d.ts

import { Session } from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    password: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/client" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string;
  }
}
