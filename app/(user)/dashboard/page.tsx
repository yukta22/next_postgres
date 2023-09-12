"use client";
import Sidebar from "@/app/components/Sidebar";
import axios from "axios";
import React, { useEffect, useState } from "react";

const page = () => {
  interface FlightData {
    title: string;
  }

  const [fligntData, setFlightsData] = useState<FlightData[]>();

  useEffect(() => {
    const getFlight = async () => {
      const result = await axios.get(
        "http://localhost:3000/api/user/getFlights"
      );
      console.log(result);
      setFlightsData(result.data);
    };
    getFlight();
  }, []);

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="w-[25%] bg-slate-100 h-screen">
        <p className="m-5 ml-8 text-neutral-600  text-2xl">Bunker Planner</p>
        <select
          className="block w-[40%] bg-slate-100  hover:border-gray-500 px-4 mx-4 py-2 rounded  leading-tight focus:outline-none focus:shadow-outline text-2xl"
          // onChange={onChange}
        >
          <option className="w-[50%] text-base	">Select Airline</option>
          {fligntData?.map((ele: any, index: number) => (
            <option
              className="w-[50%] text-base	py-1 text-lg"
              key={index}
              value={ele}
            >
              {ele.flights_name}
            </option>
          ))}
        </select>
      </main>
    </div>
  );
};

export default page;
