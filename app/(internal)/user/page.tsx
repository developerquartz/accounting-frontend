'use client';
import React, { useState, useEffect } from 'react';
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
  const [userId, setUserId] = useState(null);
  const [userDel, setUserDel] = useState(false);
  useEffect(() => {
    getData();
  }, []);

  const columnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Phone', field: 'contact' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Role', field: 'role' },

    {
      headerName: 'Action',
      field: 'actions',
      cellRenderer: (params: any) => (
        <div>
          <button onClick={() => onEditClick(params)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          {!params.data.defaultUser && (
            <button className="ml-3" onClick={() => onDeleteClick(params)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      ),
    },
  ];
  const router = useRouter();
  const onEditClick = async (params: any) => {
    router.push(`user/add-update/${params.data._id}`);
    // router.push(`user/add-update/${userId}`);
  };
  const onDeleteClick = async (params: any) => {
    // console.log(params.data._id);
    setUserId(params.data._id);
    setPopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const del = await axiosInstance.patch(`/users/${userId}`, {
        status: 2,
      });
      toast.success('User Deleted Successfully');
      console.log(del);
    } catch (error) {
      toast.error('Error in Deleting User');
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
    router.push('user/add-update');
  };

  const getData = async () => {
    await axiosInstance
      .get('/users')
      .then((response) => {
        const data = response.data.data;
        console.log(data);
        setRowData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h3 className="text-2xl text-center mb-5 mt-5">USERS TABLE</h3>
      <ConfirmationModal
        isOpen={popupOpen}
        onClose={closePopup}
        title="Confirm Delete"
        bodyText="Are you sure you want to delete this User?"
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
        ADD USER
      </button>
    </div>
  );
};

export default Client;
