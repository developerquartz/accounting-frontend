'use client';
import React, { SyntheticEvent, useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { RoleData } from './constant';
import axiosInstance from '@/app/axiosInstance';
// import Cookies from "universal-cookie";
// const cookies = new Cookies();
// const userRole = cookies.get("role");

interface ComponentProps {
  id?: string;
}

const Component: React.FC<ComponentProps> = ({ id }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<any>('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState<number>();
  const [username, setUsername] = useState('');
  const [rowData, setRowData] = useState([]);
  const [selectedClient, setSelectedClient] = useState<any>('');
  useEffect(() => {
    getData();
  }, [selectedClient]);

  useEffect(() => {
    if (id) {
      getuserData(id);
    }
  }, [id]);

  const getData = async () => {
    await axiosInstance
      .get('/clients')
      .then((resp) => {
        const data = resp.data.data;
        setRowData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getuserData = async (id: string) => {
    try {
      console.log('id', id);
      const response = await axiosInstance.get(`/users/${id}`);
      const userData = response.data.data;
      console.log('ud', userData);

      setName(userData.name);
      setContact(userData.contact);
      setEmail(userData.email);
      setRole(userData.role);
      setPassword(userData.password);
      setAddress(userData.address);
      setCity(userData.city);
      setState(userData.state);
      setPincode(userData.pincode);
      setUsername(userData.username);
      setSelectedClient(userData.clientId);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('sc', selectedClient);
    try {
      const requestData = {
        role,
        name,
        contact,
        username,
        password,
        email,
        address,
        city,
        state,
        pincode,
        clientId: selectedClient?._id,
      };
      let response;

      if (id) {
        console.log('i m in if', id);
        response = await axiosInstance
          .patch(`/users/${id}`, requestData)
          .then((response) => {
            toast.success('User Updated Successfully');
            console.log(response.data);
          })
          .catch((error) => {
            toast.error('Error in Updating User');
            console.log(error);
          });
      } else {
        response = await axiosInstance
          .post('/users/signup', requestData)
          .then((response) => {
            toast.success('User Created Successfully');
            console.log(response.data);
            router.push('/user');
          })
          .catch((error) => {
            toast.error('Error in Creating User');
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = () => {
    router.push('/user');
  };
  function getKeyByValue(object: any, value: any) {
    return Object.keys(object).find((key) => object[key] === value);
  }
  console.log('cl', selectedClient);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl text-center text-black p-4 m-4">
          {id ? 'Update User' : 'Register User'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 mt-8">
            <Listbox value={role} onChange={setRole}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate text-black">
                    {role ? getKeyByValue(RoleData, role) : 'Select Role'}
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
                    {Object.keys(RoleData).map((key) => (
                      <Listbox.Option
                        key={RoleData[key]}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-amber-100 text-amber-900'
                              : 'text-gray-900'
                          }`
                        }
                        value={RoleData[key]}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {key}
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
                    ))}
                    {role && (
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
          {role === 3 && (
            <div className="z-20 mt-10">
              <Listbox value={selectedClient} onChange={setSelectedClient}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate text-black">
                      {selectedClient.name || 'Select Client'}
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
                        console.log(item);

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
          <div className="bg-white p-4">
            <label className="text-black">Name</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="bg-white p-4">
            <label className="text-black">Contact</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              name="Contact"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="bg-white p-4">
            <label className="text-black">Username</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {!id && (
            <div className="bg-white p-4">
              <label className="text-black">Password</label>
              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
                name="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
          <div className="bg-white p-4">
            <label className="text-black">E - Mail</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              name="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}

          {/* </div> */}
          <div className="bg-white p-4">
            <label className="text-black">Address</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="bg-white p-4">
            <label className="text-black">City</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="bg-white p-4">
            <label className="text-black">State</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>

          <div className="bg-white p-4">
            <label className="text-black">Pincode</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(parseInt(e.target.value))}
            />
          </div>
        </div>
        <button
          type="submit"
          className=" text-center p-3 rounded bg-cyan-500 text-black float-right mt-3 mr-4"
          onClick={handleSubmit}
        >
          {id ? 'Update User' : 'Add User'}
        </button>
      </form>
      <button
        onClick={handleClick}
        className=" text-center p-3 rounded bg-cyan-500 text-black float-right mt-3 mr-4"
      >
        Cancel
      </button>
    </div>
  );
};

export default Component;
