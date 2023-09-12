import FlightModel from "@/app/model/flights.model";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { company_id: number } }) {
  try {
    const { company_id } = params;
    const flight = await FlightModel.getByCompanyId(company_id);
    return NextResponse.json(flight);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
