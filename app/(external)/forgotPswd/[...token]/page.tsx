"use client";
import React, { useState, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/app/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Page({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPswd, setShowPswd] = useState(false);
  console.log(params.token[0]);

  const togglePassword = () => {
    setShowPswd(!showPswd);
  };

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await axiosInstance
      .post(`/users/${params.token[0]}/${params.token[1]}`, {
        password,
      })
      .then((res) => {
        toast.success("Password Successfully Changed");
        router.push(`/login`);
      })
      .catch((error) => {
        toast.error("Error in Chnaging Password");
        console.log(error);
      });
  };

  return (
    <div className="h-screen">
      <h1 className="text-center font-bold text-4xl pt-5">RESET PASSWORD</h1>
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
                  Enter New Password
                </h1>
                <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 ">
                      Password
                    </label>
                    <input
                      type={showPswd ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="absolute bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/7 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                    <div className="float-right">
                      <button
                        onClick={togglePassword}
                        className="relative h-full mt-2 mr-3 text-white"
                      >
                        {showPswd ? (
                          <FontAwesomeIcon icon={faEyeSlash} />
                        ) : (
                          <FontAwesomeIcon icon={faEye} />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={onSubmit}
                  >
                    Submit
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
}
