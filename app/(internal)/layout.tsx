'use client';

import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const role1 = cookies.get('role');
const orgId = cookies.get('OrgId');
import { kmAggarwalId } from '../constant';
import axiosInstance from '../axiosInstance';
import axios from 'axios';

const inter = Inter({ subsets: ['latin'] });
// export const metadata: Metadata = {
//   title: "Accounatnt App",
//   description: "Created By Swayam",
// };

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setIsSelected] = useState<any>(null);
  const [role, setRole] = useState<any>('');

  const router = useRouter();

  useEffect(() => {
    setRole(role1);
  }, []);
  const onLogout = async () => {
    await axios
      .get('/api/users/logout')
      .then((resp) => {
        toast.success('logout successfully');
        router.push('/login');
      })
      .catch((error) => {
        toast.error('Logout Unsuccessful');
        console.log(error);
      });
  };
  console.log(orgId, kmAggarwalId);

  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          <main
            className={
              ' fixed overflow-clip z-50 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out ' +
              (isOpen
                ? ' transition-opacity opacity-100 duration-500 -translate-x-0  '
                : ' transition-all delay-500 opacity-0 -translate-x-full  ')
            }
          >
            <section
              className={
                ' w-screen max-w-xs left-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  ' +
                (isOpen ? ' -translate-x-0 ' : ' -translate-x-full ')
              }
            >
              {/* <article className="relative w-screen max-w-lg pb-10 flex flex-col space-y-6 overflow-y h-full"> */}
              <nav>
                <ul className="text-base p-5 text-center font-lg font-serif">
                  {role === 10 && (
                    <Link href="/firm" onClick={() => setIsSelected('admin')}>
                      <li
                        className={`p-1 mb-2 hover:bg-slate-600 hover:text-white ${
                          selected === 'admin' ? 'bg-slate-600 text-white' : ''
                        }`}
                      >
                        Firm
                      </li>
                    </Link>
                  )}
                  {role === 1 && (
                    <Link href="/user" onClick={() => setIsSelected('user')}>
                      <li
                        className={`p-1 mb-2 hover:bg-slate-600 hover:text-white ${
                          selected === 'user' ? 'bg-slate-600 text-white' : ''
                        }`}
                      >
                        User
                      </li>
                    </Link>
                  )}
                  {(role === 1 || role === 2 || role === 4) &&
                    kmAggarwalId === orgId && (
                      <Link
                        href="/bills"
                        onClick={() => setIsSelected('bills')}
                      >
                        <li
                          className={`p-1 mb-2 hover:bg-slate-600 hover:text-white ${
                            selected === 'bills'
                              ? 'bg-slate-600 text-white'
                              : ''
                          }`}
                        >
                          Bills
                        </li>
                      </Link>
                    )}
                  {role === 1 && (
                    <Link
                      href="/client"
                      onClick={() => setIsSelected('client')}
                    >
                      <li
                        className={`p-1 mb-2 hover:bg-slate-600 hover:text-white ${
                          selected === 'client' ? 'bg-slate-600 text-white' : ''
                        }`}
                      >
                        Client
                      </li>
                    </Link>
                  )}
                  {(role === 1 || role === 2 || role === 4) &&
                    kmAggarwalId === orgId && (
                      <Link
                        href="/upload"
                        onClick={() => setIsSelected('upload')}
                      >
                        <li
                          className={`p-1 mb-2 hover:bg-slate-600 hover:text-white ${
                            selected === 'upload'
                              ? 'bg-slate-600 text-white'
                              : ''
                          }`}
                        >
                          Upload
                        </li>
                      </Link>
                    )}
                  {(role === 1 || role === 2 || role === 3) && (
                    <Link href="/vault" onClick={() => setIsSelected('vault')}>
                      <li
                        className={`p-1 mb-2 hover:bg-slate-600 hover:text-white ${
                          selected === 'vault' ? 'bg-slate-600 text-white' : ''
                        }`}
                      >
                        Vault
                      </li>
                    </Link>
                  )}
                  {role === 1 && (
                    <Link
                      href="/doctype"
                      onClick={() => setIsSelected('doctype')}
                    >
                      <li
                        className={`p-1 mb-2 hover:bg-slate-600 hover:text-white ${
                          selected === 'doctype'
                            ? 'bg-slate-600 text-white'
                            : ''
                        }`}
                      >
                        Document Type
                      </li>
                    </Link>
                  )}
                </ul>
              </nav>
              {/* </article> */}
            </section>
            <section
              className=" w-screen h-full cursor-pointer "
              onClick={() => {
                setIsOpen(false);
              }}
            ></section>
          </main>

          <nav className="bg-white border-gray-200 dark:bg-gray-500 dark:border-gray-700">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
              <main style={{ display: 'flex', padding: 10 }}>
                <div>
                  <button
                    className="sb-button"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                </div>
              </main>
              <a href="#" className="flex items-center">
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-8 mr-3"
                  alt="Flowbite Logo"
                />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  ACCOUNTANT
                </span>
              </a>
              <div
                className="hidden w-full md:block md:w-auto"
                id="navbar-dropdown"
              >
                <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                  <li>
                    <button
                      className=" bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="container mx-auto">
            {children}
            <ToastContainer />
          </div>
        </>
      </body>
    </html>
  );
}
