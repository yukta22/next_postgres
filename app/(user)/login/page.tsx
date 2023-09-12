"use client";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
interface User {
  email?: string;
  password?: string;
  company_id?: number;
}

interface Flight {
  title?: string;
  company_id?: number;
}
const page = () => {
  // const { data: session } = useSession();

  const router = useRouter();
  const [data, setData] = useState<User>();
  const [error, setError] = useState<string>();
  const [flag, setFlag] = useState<boolean>(false);
  // const [flights, setFlights] = useState<Flight>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loginWithgoogle = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const resp = await signIn("google", {
      redirect: false,
      callbackUrl: "/dashboard",
    });
    console.log(resp);

    if (resp?.error) {
      setError("Invalid credentials");
    }
  };

  const login = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const resp = await signIn("credentials", {
      email: data?.email,
      password: data?.password,
      redirect: false,
      // callbackUrl: "/dashboard",
    });
    console.log(resp);
    if (resp?.error) {
      setFlag(true);
      setError("Invalid credentials");
    } else {
      router.push("/dashboard");
    }

    setData({});
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const res = await axios.post("http://localhost:3000/api/user/login", data);
  //   console.log(res);

  //   // const getflight = await getFlight(res?.data?.findUser?.email);

  //   // // console.log(getflight.data);
  //   if (res.data.findUser) {
  //     localStorage.setItem("email", res?.data?.findUser?.email);
  //     router.push(`${res?.data?.findUser?.company_name}`);
  //   }
  // };
  // console.log(error);

  return (
    <>
      <div className=" mx-auto mt-44 max-w-md ">
        <form
          className="bg-teal-100 shadow-md rounded px-8 pt-6 pb-8 mb-4"
          // onSubmit={handleSubmit}
        >
          {flag && (
            <div className="text-red-700 pb-4 font-bold text-center">
              Invalid Credential
            </div>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="Email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Email"
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data?.email || ""}
              // required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data?.password || ""}
              // required
            />
          </div>
          <div className="w-full">
            <button
              className="bg-teal-500 w-full hover:bg-teal-400 text-white font-bold py-2  rounded focus:outline-none focus:shadow-outline"
              type="button"
              data-testid="login"
              onClick={(e) => login(e)}
            >
              Sign In
            </button>
          </div>
          <div className="inline-flex items-center justify-center w-full">
            <hr className="w-96 mx-1 h-px my-8 bg-gray-500 border-0 dark:bg-gray-500" />
            <span className="absolute px-2 bg-teal-100 font-medium text-gray-600	 -translate-x-1/2  left-1/2 dark:text-white dark:bg-gray-900">
              OR
            </span>
          </div>
          <button
            className="w-full px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-800 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150 bg-white"
            data-testid="loginWithgoogle"
            onClick={(e) => loginWithgoogle(e)}
          >
            <div className="flex mx-[80px]">
              <img
                className="w-6 h-6 "
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
              />
              <span className="ml-3">Continue with Google</span>
            </div>
          </button>
        </form>
      </div>
    </>
  );
};

export default page;
