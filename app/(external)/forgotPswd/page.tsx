"use client";
import React, { useState, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/app/axiosInstance";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const onLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    await axiosInstance
      .get(`/users/forgot-password?username=${username}`)
      .then((res) => {
        toast.success("Reset link has been sent to your registered Email");
        const data = res.data;
        console.log(data.data);
      })
      .catch((error) => {
        toast.error("No Account Found. Plz register");
        console.log(error);
      });
  };
  return (
    <div className="h-screen">
      <h1 className="text-center font-bold text-4xl pt-5">FORGOT PASSWORD</h1>
      <div className="flex flex-col md:flex-row ">
        <div className="md:w-2/12 "></div>

        <div className="md:w-8/12 flex flex-row pt-32">
          <div className=" md:w-6/12 pt-10">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="w-full"
              alt="Phone image"
            />
          </div>
          <div className="flex flex-row">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                  Find Your Account
                </h1>
                <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 ">
                      Enter your Username
                    </label>
                    <input
                      type="text"
                      name="text"
                      id="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="swayam@123"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={onLogin}
                  >
                    Next
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-2/12"></div>
      </div>
    </div>
  );
};

export default Login;
