"use client";
import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import axiosInstance from "@/app/axiosInstance";
const cookies = new Cookies();
const token = cookies.get("token");

const UploadScreen = () => {
  const Year = [
    { id: 1, year: "2015 - 2016 / 2016 - 2017" },
    { id: 2, year: "2016 - 2017 / 2017 - 2018" },
    { id: 3, year: "2018 - 2019 / 2019 - 2020" },
    { id: 4, year: "2020 - 2021 / 2021 - 2022" },
    { id: 5, year: "2021 - 2022 / 2022 - 2023" },
    { id: 6, year: "2022 - 2023 / 2023 - 2024" },
    { id: 7, year: "2023 - 2024 / 2024 - 2025" },
  ];

  const Month = [
    { id: 1, month: "Jan" },
    { id: 2, month: "Feb" },
    { id: 3, month: "March" },
    { id: 4, month: "April" },
    { id: 5, month: "May" },
    { id: 6, month: "June" },
    { id: 7, month: "July" },
    { id: 8, month: "August" },
    { id: 9, month: "September" },
    { id: 10, month: "October" },
    { id: 11, month: "November" },
    { id: 12, month: "December" },
  ];

  const Quarter = [
    { id: 1, quarter: "1st Quarter" },
    { id: 2, quarter: "2nd Quarter" },
    { id: 3, quarter: "3rd Quarter" },
    { id: 4, quarter: "4th Quarter" },
  ];

  const [rowData, setRowData] = useState([]);
  const [selectedClient, setSelectedClient] = useState<any>("");
  const [typeData, setTypeData] = useState<any>([]);
  const [file, setFile] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>("");
  const [selectedYear, setSelectedYear] = useState<any>(Year);
  const [selectedMonth, setSelectedMonth] = useState<any>(Month);
  const [selectedQuarter, setSelectedQuarter] = useState<any>(Quarter);
  const [remark, setRemark] = useState("");
  const router = useRouter();
  useEffect(() => {
    getData();
  }, [selectedClient]);
  const getData = async () => {
    await axiosInstance
      .get("/clients/filter")
      .then((resp) => {
        setRowData(resp.data.data);
        console.log(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDocData();
  }, []);
  const getDocData = async () => {
    await axiosInstance
      .get("/doctypes")
      .then((resp) => {
        setTypeData(resp.data.data);
        console.log(typeof resp.data.data, resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log("data", typeData.frequency, selectedType.frequency);
  const handleUpload = async () => {
    let bill: any = await axiosInstance.get("/images").catch((error) => {
      console.log(error);
    });
    console.log("urlr", bill);

    const url = bill.data;
    console.log(url);

    const data = await axios
      .put(url, file, {
        headers: {
          "Content-Type": "application/pdf",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    const imageUrl = url.split("?")[0];
    const final = await axiosInstance
      .post("/vaults", {
        name: selectedType._id,
        fileType: "pdf",
        fileLink: imageUrl,
        clientId: selectedClient._id,
        year: selectedYear.year,
        month: selectedMonth.month,
        quarter: selectedQuarter.quarter,
        remarks: remark,
      })
      .then((res) => {
        console.log(res);
        router.push("/vault");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h3 className=" text-center text-amber-700 text-3xl mt-5">
        VAULT UPLOAD PAGE
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-1 ">
        <div className="w-72">
          <Listbox value={selectedClient} onChange={setSelectedClient}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate text-black">
                  {selectedClient ? selectedClient.name : "Select Client"}
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
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={item}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
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
        <div className="w-72">
          <Listbox value={selectedType} onChange={setSelectedType}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate text-black">
                  {selectedType ? selectedType.name : "Select Type"}
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
                  {typeData.map((item: any) => {
                    return (
                      <Listbox.Option
                        key={item._id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={item}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
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
                  {selectedType && (
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
        {(selectedType.frequency === 1 ||
          selectedType.frequency === 2 ||
          selectedType.frequency === 3) && (
          <div className="w-72">
            <Listbox value={selectedYear} onChange={setSelectedYear}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate text-black">
                    {selectedYear.year || "Select Financial/Assessment Year"}
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
                    {Year.map((item: any) => {
                      return (
                        <Listbox.Option
                          key={item.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={item}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {item.year}
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
                    {selectedYear && (
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

        {selectedType.frequency === 2 && (
          <div className="w-72">
            <Listbox value={selectedMonth} onChange={setSelectedMonth}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate text-black">
                    {selectedMonth.month || "Select Month"}
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
                    {Month.map((item: any) => {
                      return (
                        <Listbox.Option
                          key={item.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={item}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {item.month}
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
                    {selectedMonth && (
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

        {selectedType.frequency === 3 && (
          <div className="w-72">
            <Listbox value={selectedQuarter} onChange={setSelectedQuarter}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate text-black">
                    {selectedQuarter.quarter || "Select Quarter"}
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
                    {Quarter.map((item: any) => {
                      return (
                        <Listbox.Option
                          key={item.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={item}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {item.quarter}
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
                    {selectedQuarter && (
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
      </div>

      <div>
        <span>Manager Remarks</span>
        <textarea
          id="message"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any remarks you would like to give..."
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        ></textarea>
      </div>

      <div className="mt-5 text-center">
        <div className="border-2 border-slate-700 border-dotted h-96">
          <h1 className="mt-10 text-3xl text-cyan-800">UPLOAD CLIENT DOCS</h1>
          <div className="mt-20">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : "")}
            />

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
              onClick={handleUpload}
            >
              Upload Docs
            </button>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
