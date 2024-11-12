'use client';
import React, { SyntheticEvent, useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Frequency } from '../../../constant';
import axiosInstance from '@/app/axiosInstance';

interface ComponentProps {
  id?: string;
}

const Component: React.FC<ComponentProps> = ({ id }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [rowData, setRowData] = useState([]);
  const [frequency, setFrequency] = useState<any>();
  const [clientUpload, setClientUpload] = useState(false);
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (id) {
      getDocData(id);
    }
  }, [id]);

  const getData = async () => {
    await axiosInstance
      .get('/doctypes')
      .then((resp) => {
        const data = resp.data.data;
        setRowData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getDocData = async (id: string) => {
    try {
      console.log('id', id);
      const response = await axiosInstance.get(`/doctypes/${id}`);
      const data = response.data;

      setName(data.name);
      setFrequency(data.frequency);
      setClientUpload(data.clientUpload);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const requestData = {
        name,
        frequency,
        clientUpload,
      };
      let response;

      if (id) {
        console.log('i m in if', id);
        response = await axiosInstance
          .patch(`/doctypes/${id}`, requestData)
          .then((response) => {
            toast.success('Doc Type Updated Successfully');
            router.push('/doctypes');
            console.log(response.data);
          })
          .catch((error) => {
            toast.error('Error in Updating Doc Type');
            console.log(error);
          });
      } else {
        response = await axiosInstance
          .post('/doctypes', requestData)
          .then((response) => {
            toast.success('Doc Type Created Successfully');
            console.log(response.data);
            router.push('/doctype');
          })
          .catch((error) => {
            toast.error('Error in Creating Doc Type');
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = () => {
    router.push('/doctype');
  };
  function getKeyByValue(object: any, value: any) {
    return Object.keys(object).find((key) => object[key] === value);
  }
  console.log('key', frequency);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl text-center text-black p-4 m-4">
          {id ? 'Update Document Type' : 'Create Document Type'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white">
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
          <div className="bg-white mt-4">
            <Listbox value={frequency} onChange={setFrequency}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate text-black">
                    {frequency
                      ? getKeyByValue(Frequency, frequency)
                      : 'Select Frequency'}
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
                    {Object.keys(Frequency).map((key) => (
                      <Listbox.Option
                        key={Frequency[key]}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-amber-100 text-amber-900'
                              : 'text-gray-900'
                          }`
                        }
                        value={Frequency[key]}
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
                    {frequency && (
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
          <Listbox value={clientUpload} onChange={setClientUpload}>
            <div className="mt-4">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate text-black">Client Upload</span>
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
                <Listbox.Options className="absolute mt-1 max-h-60 w-1/6 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                      }`
                    }
                    value={true} // For Multi Bill
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          True
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                      }`
                    }
                    value={false} // For Single Bill
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          False
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        <button
          type="submit"
          className=" text-center p-3 rounded bg-cyan-500 text-black float-right mt-3 mr-4"
          onClick={handleSubmit}
        >
          {id ? 'Update Doc Type' : 'Add Doc Type'}
        </button>
      </form>
      {/* <button
        onClick={handleClick}
        className=" text-center p-3 rounded bg-cyan-500 text-black float-right mt-3 mr-4"
      >
        Add Type
      </button> */}
    </div>
  );
};

export default Component;
