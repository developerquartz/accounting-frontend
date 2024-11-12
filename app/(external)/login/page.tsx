'use client';
import React, { useState, SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';
import { kmAggarwalId } from '@/app/constant';
const cookies = new Cookies();

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPswd, setShowPswd] = useState(false);

  const togglePassword = () => {
    setShowPswd(!showPswd);
  };

  const onLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    await axios
      .post('/api/users/signin', {
        username,
        password,
      })
      .then((res) => {
        toast.success('Login Successfully');
        const userRole = cookies.get('role');
        const orgId = cookies.get('OrgId');
        if (userRole === 10) {
          router.push('/firm');
        } else if (userRole === 1 || userRole === 2) {
          if (kmAggarwalId === orgId) router.push('/bills');
          else router.push('/vault');
        } else if (userRole === 3) {
          router.push('/vault');
        } else {
          router.push('/upload');
        }
      })
      .catch((error) => {
        toast.error('Error while Signing In');
        console.log(error);
      });
  };
  return (
    <div className="h-screen">
      <h1 className="text-center font-bold text-4xl pt-5">LOGIN FORM</h1>
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
                  Sign in to your account
                </h1>
                <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 ">
                      Your Username
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
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 ">
                      Password
                    </label>
                    <input
                      type={showPswd ? 'text' : 'password'}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="absolute bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/6 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />

                    <div className="float-right">
                      <div
                        onClick={togglePassword}
                        className="relative h-full mt-3 mr-3 text-white"
                      >
                        {showPswd ? (
                          <FontAwesomeIcon icon={faEyeSlash} />
                        ) : (
                          <FontAwesomeIcon icon={faEye} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <a
                      href="forgotPswd"
                      className="font-sm text-blue-600 hover:underline hover:text-red-400 dark:text-primary-500 mt-8 "
                    >
                      Forgot Password
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={onLogin}
                  >
                    Sign in
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
