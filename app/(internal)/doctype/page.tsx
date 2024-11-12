'use client';
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { ColDef } from 'ag-grid-community';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../confirmationPopup.js';
import AgGridComponent from '../../grid';
import axiosInstance from '@/app/axiosInstance';
import { toast } from 'react-toastify';

const Vault = () => {
  const [rowData, setRowData] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [docId, setDocId] = useState('');

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    await axiosInstance
      .get('/doctypes')
      .then((resp) => {
        setRowData(resp.data.data);
        console.log(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const router = useRouter();

  const handleClick = () => {
    router.push('/doctype/add-update');
  };
  const columnDefs: ColDef[] = [
    { headerName: 'Doc Name', field: 'name' },
    { headerName: 'Frequency of Docs', field: 'frequency' },
    { headerName: 'Client Upload', field: 'clientUpload' },

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
    setDocId(params.data._id);
    setPopupOpen(true);
  };

  const confirmDelete = async (params: any) => {
    try {
      await axiosInstance.patch(`/doctypes/${docId}`, {
        status: 2,
      });
      toast.success('Doc Successfully Deleted');
    } catch (error) {
      toast.error('Error in Deleting Doc');
      console.log(error);
    } finally {
      setPopupOpen(false);
    }
    getData();
  };
  const closePopup = () => {
    setPopupOpen(false);
  };
  const onEditClick = (params: any) => {
    router.push(`doctype/add-update/${params.data._id}`);
  };
  return (
    <div>
      <ConfirmationModal
        isOpen={popupOpen}
        onClose={closePopup}
        title="Confirm Delete"
        bodyText="Are you sure you want to delete this Document?"
        deleteButtonText="Delete"
        cancelButtonText="Cancel"
        onButtonClick={confirmDelete}
      />
      <AgGridComponent rowData={rowData} columnDefs={columnDefs} />
      <button
        onClick={handleClick}
        className=" text-center p-3 rounded bg-cyan-500 text-black float-right mt-3 mr-4"
      >
        Add Type
      </button>
    </div>
  );
};

export default Vault;
