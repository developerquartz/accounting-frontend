'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { ColDef } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import { StatusData } from './constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import ConfirmationModal from '../../confirmationPopup.js';
import AgGridComponent from '../../grid';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../axiosInstance';

const Bill = () => {
  const [billId, setBillId] = useState();
  const [rowData, setRowData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [selectedClient, setSelectedClient] = useState<any>('');
  const [selectedBillType, setSelectedBillType] = useState<any>('');
  const [billTypeData, setBillTypeData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState<any>('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getData();
  }, [
    selectedClient,
    selectedBillType,
    selectedStatus,
    startDateFilter,
    endDateFilter,
    page,
  ]);

  useEffect(() => {
    getClientData();
  }, []);

  const getClientData = async () => {
    await axiosInstance
      .get('/clients/filter')
      .then((res) => {
        const data = res.data.data;
        setClientData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getBillData();
  }, []);

  const getBillData = async () => {
    await axiosInstance
      .get('/bill-types')
      .then((res) => {
        const data = res.data.data;
        console.log('khb', data);

        setBillTypeData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePageChange = (newPage: any) => {
    setPage(newPage);
  };
  const columnDefs: ColDef[] = [
    { headerName: 'Client Name', field: 'client.name' },
    { headerName: 'Bill Type', field: 'billType.billName' },
    { headerName: 'Status', field: 'status' },
    { headerName: 'Remarks', field: 'remarks' },
    { headerName: 'Suggestions', field: 'suggestions' },
    {
      headerName: 'Action',
      field: 'actions',
      cellRenderer: (params: any) => (
        <div>
          <button onClick={() => onEditClick(params)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>

          <button className="ml-3" onClick={() => onDeleteClick(params)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
  ];
  const onDeleteClick = async (params: any) => {
    setBillId(params.data._id);
    setPopupOpen(true);
  };

  const confirmDelete = async (params: any) => {
    try {
      console.log('bill', billId);

      await axiosInstance.patch(`/bill/${billId}`, {
        deleteStatus: 2,
      });
      toast.success('Bill Successfully Deleted');
    } catch (error) {
      toast.error('Error in Deleting Bill');
      console.log(error);
    } finally {
      setPopupOpen(false);
    }
    getData();
  };
  const closePopup = () => {
    setPopupOpen(false);
  };
  const router = useRouter();
  const onEditClick = (params: any) => {
    router.push(`bills/${params.data._id}`);
  };

  const onShow = async () => {
    setSelectedClient('');
    setSelectedBillType('');
    setSelectedStatus('');
    setStartDateFilter('');
    setEndDateFilter('');
    try {
      const response = await axiosInstance.get('/bill');
      setRowData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    const skip = (page - 1) * itemsPerPage;
    await axiosInstance
      .get('/bill', {
        params: {
          client: selectedClient,
          billType: selectedBillType,
          status: selectedStatus,
          fromDate: startDateFilter,
          toDate: endDateFilter,
          limit: itemsPerPage,
          skip: skip,
          orderBy: 'createdAt',
          SortOrder: -1,
        },
      })
      .then((resp) => {
        const data = resp.data.data;
        setRowData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log('client is', selectedClient);
  function getKeyByValue(object: any, value: any) {
    return Object.keys(object).find((key) => object[key] === value);
  }
  console.log('abhgi', clientData);

  return (
    <div className="mt-5">
      <h3 className="text-2xl text-center">BILLS TABLE</h3>
      <div>
        <ConfirmationModal
          isOpen={popupOpen}
          onClose={closePopup}
          title="Confirm Delete"
          bodyText="Are you sure you want to delete this User?"
          deleteButtonText="Delete"
          cancelButtonText="Cancel"
          onButtonClick={confirmDelete}
        />
      </div>

      <div className="grid grid-cols-6 gap-2">
        <div className="z-20">
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
                  {clientData.map((item: any) => {
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

        <div className="z-20">
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
                  {billTypeData.map((item: any) => {
                    // console.log("data", item);

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
                          </>
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

        <div className="z-20">
          <Listbox value={selectedStatus} onChange={setSelectedStatus}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate text-black">
                  {selectedStatus
                    ? getKeyByValue(StatusData, selectedStatus)
                    : 'Select Status'}
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
                  {Object.keys(StatusData).map((key) => (
                    <Listbox.Option
                      key={StatusData[key]}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? 'bg-amber-100 text-amber-900'
                            : 'text-gray-900'
                        }`
                      }
                      value={StatusData[key]}
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
                  {selectedStatus && (
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

        <div className="relative mt-1">
          <input
            type="date"
            placeholder="Start Date"
            className="relative cursor-default rounded-lg bg-white py-2 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
        </div>

        <div className="relative mt-1 ">
          <input
            type="date"
            placeholder="End Date"
            className="relative cursor-default rounded-lg py-2 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          />
        </div>
        <button
          onClick={onShow}
          className="bg-blue-500 hover:bg-blue-700 text-black rounded"
        >
          Clear
        </button>
      </div>

      <div>
        <AgGridComponent rowData={rowData} columnDefs={columnDefs} />
      </div>
      <button onClick={() => handlePageChange(page - 1)}>Previous Page</button>

      <span>Page {page}</span>

      <button
        className="float-right"
        onClick={() => handlePageChange(page + 1)}
      >
        Next Page
      </button>
    </div>
  );
};

export default Bill;
