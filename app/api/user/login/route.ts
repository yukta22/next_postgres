import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "@/app/model/user.model";

interface User {
  id: number;
  email: string;
  password: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { email, password } = await req.json();
    console.log("POST", email, password);
    const findUsers: any = await UserModel.getUser(email);
    console.log(findUsers);

    // if (findUsers.length === 0) {
    //   return NextResponse.json({ message: "Invalid credentials" });
    // }
    // const findUser = findUsers[0];
    // const passwordMatch = await bcrypt.compare(password, findUser.password);
    // if (!passwordMatch) {
    //   return NextResponse.json({ message: "Invalid credentials" });
    // }
    // return NextResponse.json({ findUser });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json(err);
  }
}
