import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/model/user.model";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();

    const { email, password, company_id } = data;

    await UserModel.create(email, password, company_id);
    return NextResponse.json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(err);
  }
}
