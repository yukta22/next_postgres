import CompanyModel from "@/app/model/company.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    const { name } = data;
    await CompanyModel.insert(name);
    return NextResponse.json({ message: "Companies inserted successfully" });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(error);
  }
}

export async function GET() {
  try {
    const companies = await CompanyModel.getAll();
    return NextResponse.json(companies);
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(error);
  }
}
