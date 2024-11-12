'use client';
import React, { useState, useEffect, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/app/axiosInstance';

const UploadScreen = () => {
  const [rowData, setRowData] = useState([]);
  const [billData, setBillData] = useState([]);
  const [selectedClient, setSelectedClient] = useState<any>('');
  const [selectedBillType, setSelectedBillType] = useState<any>('');
  const [file, setFile] = useState<any>([]);
  const [multiBill, setMultiBill] = useState(false);

  useEffect(() => {
    getClientData();
  }, [selectedClient]);
  useEffect(() => {
    getBillType();
  }, [selectedClient]);

  const getClientData = async () => {
    await axiosInstance
      .get('/clients/filter')
      .then((resp) => {
        setRowData(resp.data.data);
        console.log(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const router = useRouter();
  const getBillType = async () => {
    await axiosInstance
      .get('/bill-types')
      .then((resp) => {
        setBillData(resp.data.data);
        console.log(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpload = async () => {
    if (multiBill) {
      await uploadMultipleBill();
    } else {
      await uploadSingleBill();
    }
  };
  const uploadSingleBill = async () => {
    let bill: any = await axiosInstance.get('/images').catch((error) => {
      console.log(error);
    });
    console.log(bill);

    const url = bill.data;

    const data = await axios
      .put(url, file, {
        headers: {
          'Content-Type': 'application/pdf',
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    const imageUrl = url.split('?')[0];
    const final = await axiosInstance
      .post('/bill', {
        client: selectedClient,
        billType: selectedBillType,
        link: imageUrl,
      })
      .then((res) => {
        console.log(res);
        router.push('/bills');
      })
      .catch((error) => {
        console.log(error);
      });

    //   // const img = document.createElement("img");
    //   // img.src = imageUrl;
    //   // document.body.appendChild(img);
  };

  const uploadMultipleBill = async () => {
    console.log('dat', file);
    const fileObjToArr = Object.values(file);
    console.log('da', fileObjToArr);

    const filesArr: string[] = [];
    await Promise.all(
      fileObjToArr.map(async (files: any) => {
        let bill: any = await axiosInstance.get('/images').catch((error) => {
          console.log(error);
        });
        const url = bill.data;
        // for (let i = 0; i < file.length; i++) {
        //   const files = file[i];
        await axios
          .put(url, files, {
            headers: {
              'Content-Type': 'application/pdf',
            },
          })
          .then((res) => {
            console.log(res);
            const imageUrl = url.split('?')[0];
            filesArr.push(imageUrl);
          })
          .catch((error) => {
            console.log(error);
          });
      }),
    );
    console.log(filesArr, 'filesLink', typeof filesArr);

    const final = await axiosInstance
      .post('/bill/multi', {
        client: selectedClient._id,
        billType: selectedBillType._id,
        links: filesArr,
      })
      .then((res) => {
        console.log(res);
        router.push('/bills');
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="">
      <h3 className=" text-center text-amber-700 text-3xl mt-5">UPLOAD PAGE</h3>
      <div className="flex flex-row mt-10 ml-10">
        <div className="w-72 z-20">
          <Listbox value={selectedClient} onChange={setSelectedClient}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate text-black">
                  {selectedClient ? selectedClient.name : 'Select a Client'}
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
        <div className="w-72 z-20">
          <Listbox value={selectedBillType} onChange={setSelectedBillType}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate text-black">
                  {selectedBillType
                    ? selectedBillType.billName
                    : 'Select Bill Type'}
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
                  {billData.map((item: any) => {
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
                          <div>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {item.billName}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </div>
                        )}
                      </Listbox.Option>
                    );
                  })}
                  {selectedBillType && (
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
        <div className="w-72">
          <Listbox value={multiBill} onChange={setMultiBill}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate text-black">No. of Bills</span>
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
                          Multi Bill
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
                          Single Bill
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
      </div>

      <div className="p-5 mt-5 text-center">
        <div className="border-2 border-slate-700 border-dotted h-96">
          <h1 className="mt-10 text-3xl text-cyan-800">
            UPLOAD YOUR DOCUMENTS HERE
          </h1>
          {/* <div className="mb-5 h-4 overflow-hidden rounded-full bg-gray-200">
            <div className="h-4 animate-pulse rounded-full bg-gradient-to-r from-green-500 to-blue-500 w-3/4">
              Bar
            </div>
          </div> */}
          <div className="mt-20">
            <input
              type="file"
              multiple
              onChange={(e) => setFile(e.target.files ? e.target.files : '')}
            />

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-xl"
              onClick={handleUpload}
            >
              Upload Bill
            </button>
          </div>{' '}
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
