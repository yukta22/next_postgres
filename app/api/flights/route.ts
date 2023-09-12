import FlightModel from "@/app/model/flights.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const flights = await FlightModel.getAll();
    return NextResponse.json(flights);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    const { title, company_id } = data;
    await FlightModel.create(title, company_id);
    return NextResponse.json("Flight is created successfully");
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(error);
  }
}
