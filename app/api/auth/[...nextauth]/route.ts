import { Awaitable, NextAuthOptions, RequestInternal } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";
import bcrypt from "bcryptjs";
import UserModel from "@/app/model/user.model";
import pool from "@/app/db/database";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // const client = await pool.connect();
          // const queryResult = await client.query(
          //   "SELECT datname FROM pg_database WHERE datname LIKE '%_tenant'"
          // );
          // const result = queryResult.rows.map((row) => row.datname);
          // console.log("CredentialsProvider credentials:", credentials);
          // console.log("queryResult", queryResult.rowCount);
          // console.log("result", result);
          const findUsers: any = await UserModel.getUser(credentials?.email!);
          // console.log("findUsers", findUsers);

          if (findUsers?.length === 0) {
            return null;
          }
          const findUser = findUsers[0];
          // console.log("findUser", findUser);
          // console.log(credentials?.password!, findUser?.password!);

          const passwordMatch = await bcrypt.compare(
            credentials?.password!,
            findUser?.password!
          );
          // console.log("passwordMatch", passwordMatch);

          if (!passwordMatch) {
            return null;
          }
          return findUser;
        } catch (e: any) {
          console.log(e);

          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.email = user.email;
      }
      // console.log("token", token);

      return token;
    },
    async session({ session, token }: any) {
      session.user = token as any;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
