import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/model/user.model";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const users = await UserModel.getAll();
    return NextResponse.json(users);
  } catch (err) {
    console.log(err);
    return NextResponse.json(err);
  }
}
