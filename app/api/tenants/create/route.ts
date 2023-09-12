import Company_tenantsModel from "@/app/model/company_tenants.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();

    // console.log(data);

    const {
      companyName,
      userEmail,
      rules,
      first_name,
      last_name,
      password,
      role,
    } = data;

    await Company_tenantsModel.createTenantDatabase(
      companyName,
      userEmail,
      rules,
      first_name,
      last_name,
      password,
      role
    );

    return NextResponse.json({ message: "tenants created successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
