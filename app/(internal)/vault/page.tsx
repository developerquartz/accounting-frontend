'use client';
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Cookies from 'universal-cookie';
import axiosInstance from '@/app/axiosInstance';

const cookies = new Cookies();
const Vault = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedClient, setSelectedClient] = useState<any>('');
  const [docData, setDocData] = useState<any>([]);
  const [userRole, setUserRole] = useState<number>();
  useEffect(() => {
    getData();
  }, [selectedClient]);
  const getData = async () => {
    await axiosInstance
      .get('/clients/filter')
      .then((resp) => {
        setRowData(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(rowData);

  useEffect(() => {
    getDoc();
  }, []);
  const getDoc = async () => {
    await axiosInstance
      .get('/doctypes')
      .then((resp) => {
        setDocData(resp.data.data);
        console.log(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const role = cookies.get('role');
    setUserRole(role);
  });

  const token = cookies.get('token');
  const loggedInClient = cookies.get('clientId');
  console.log('hydCheck', loggedInClient);
  console.log('hydrationCheck', userRole);

  const router = useRouter();
  const setClick = async (item: any) => {
    {
      userRole === 3 && router.push(`vault/${loggedInClient}/${item._id}`);
      userRole === 1 && router.push(`vault/${selectedClient?._id}/${item._id}`);
    }
  };
  const handleClick = () => {
    router.push('vault/upload');
  };
  return (
    <div>
      <h3 className="text-2xl text-center mb-5 mt-5">VAULT</h3>
      {(userRole === 1 || userRole == 2) && (
        <div className="w-72">
          <Listbox value={selectedClient} onChange={setSelectedClient}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate text-black">
                  {selectedClient ? selectedClient.name : 'Select Client'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {rowData.map((item: any) => {
                    return (
                      <Listbox.Option
                        key={item._id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-amber-100 text-amber-900'
                              : 'text-gray-900'
                          }`
                        }
                        value={item}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {item.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    );
                  })}
                  {selectedClient && (
                    <Listbox.Option
                      className="cursor-pointer py-2 pl-10 pr-4 bg-amber-100 text-amber-900"
                      value=""
                    >
                      Clear
                    </Listbox.Option>
                  )}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 ">
        {docData.map((item: any, index: any) => (
          <div
            key={index}
            className="flex items-center justify-center m-5 min-h-[5rem] bg-white text-gray-700 shadow-lg overflow-hidden rounded-xl cursor-pointer"
            onClick={() => setClick(item)}
          >
            <h4>{item.name}</h4>
          </div>
        ))}
      </div>
      {userRole === 1 && (
        <button
          type="submit"
          className="text-center p-3 rounded bg-cyan-500 text-black float-right mt-3 mr-4"
          onClick={handleClick}
        >
          ADD DOC
        </button>
      )}
    </div>
  );
};

export default Vault;
