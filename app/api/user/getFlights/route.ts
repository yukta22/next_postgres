import UserModel from "@/app/model/user.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import TenantsModel from "@/app/model/tenant.model";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // const { email } = await req.json();
    const token = await getToken({ req: req });
    // console.log(token);

    const flights = await TenantsModel.getFlightsInDatabase(token?.email!);
    // console.log(flights);

    return NextResponse.json(flights);
  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
}
