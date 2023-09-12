"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

const Provider = ({
  session,
  children,
}: {
  session: any;
  children: React.ReactNode;
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Provider;
