'use client';
import React, { useState, useEffect } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { ColDef } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../confirmationPopup.js';
import AgGridComponent from '@/app/grid.js';
import { toast } from 'react-toastify';
import axiosInstance from '@/app/axiosInstance.js';

const Client = () => {
  const [rowData, setRowData] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const columnDefs: ColDef[] = [
    { headerName: 'Company Name', field: 'name' },
    { headerName: 'Contact Person', field: 'contactPerson' },
    { headerName: 'Contact', field: 'contact' },
    { headerName: 'GST No.', field: 'gst' },
    { headerName: 'PAN No.', field: 'pan' },

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
  const router = useRouter();
  const onEditClick = async (params: any) => {
    setClientId(params.data._id);
    {
      console.log('Log in Client', params.data._id);
    }
    router.push(`client/add-update/${params.data._id}`);
  };

  const onDeleteClick = async (params: any) => {
    console.log(params.data._id);
    setClientId(params.data._id);
    setPopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const del = await axiosInstance.patch(`clients/${clientId}`, {
        status: 2,
      });
      toast.success('Client Deleted Successfully');
      console.log(del);
    } catch (error) {
      toast.error('Error in Deleting Successfully');
      console.log(error);
    } finally {
      setPopupOpen(false);
    }
    getData();
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const handleClick = () => {
    router.push('client/add-update');
  };

  const getData = async () => {
    try {
      await axiosInstance.get('/clients/filter').then((response) => {
        const data = response.data.data;
        setRowData(data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h3 className="text-2xl text-center mb-5 mt-5">CLIENTS TABLE</h3>
      <ConfirmationModal
        isOpen={popupOpen}
        onClose={closePopup}
        title="Confirm Delete"
        bodyText="Are you sure you want to delete this Client?"
        deleteButtonText="Delete"
        cancelButtonText="Cancel"
        onButtonClick={confirmDelete}
      />
      <div>
        <AgGridComponent rowData={rowData} columnDefs={columnDefs} />
      </div>

      <button
        type="submit"
        className=" text-center p-3 rounded bg-cyan-500 text-black float-right mt-3 mr-4"
        onClick={handleClick}
      >
        ADD CLIENT
      </button>
    </div>
  );
};

export default Client;
