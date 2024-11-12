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
import { faBan, faSquareCheck } from '@fortawesome/free-solid-svg-icons';

const Admin = () => {
  const [rowData, setRowData] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [organizationId, setOrganizationId] = useState(null);
  const [userDel, setUserDel] = useState(false);
  const [status, setStatus] = useState(false);
  const [enablePopup, setEnablePopup] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const columnDefs: ColDef[] = [
    { headerName: 'Firm Name', field: 'name' },
    { headerName: 'Total Client', field: 'totalClient' },
    { headerName: 'Firm Contact', field: 'contact' },
    { headerName: 'Contact Person', field: 'contactPersonId.name' },
    { headerName: 'Person Contact', field: 'contactPersonId.contact' },
    { headerName: 'Status', field: 'statusLabel' },

    {
      headerName: 'Action',
      field: 'actions',
      cellRenderer: (params: any) => (
        <div>
          <button onClick={() => onEditClick(params)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          {userDel === false && (
            <button className="ml-3" onClick={() => onDeleteClick(params)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
          <button className="ml-3" onClick={() => chnageStatus(params)}>
            {params.data.status === 1 ? (
              <FontAwesomeIcon icon={faBan} className="text-red-400" />
            ) : (
              <FontAwesomeIcon
                icon={faSquareCheck}
                className="text-green-500"
              />
            )}
          </button>
        </div>
      ),
    },
  ];
  const router = useRouter();
  const onEditClick = async (params: any) => {
    router.push(`firm/add-update/${params.data._id}`);
  };

  const onDeleteClick = async (params: any) => {
    console.log(params.data._id);
    setOrganizationId(params.data._id);
    setPopupOpen(true);
  };

  const chnageStatus = async (params: any) => {
    console.log('Status', params.data.status);
    setStatus(params.data.status === 1);
    console.log('data', params.data.status === 1);
    setOrganizationId(params.data._id);
    setEnablePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const del = await axiosInstance.patch(
        `/organizations/${organizationId}`,
        {
          status: 2,
        },
      );
      await axiosInstance.get(`/organizations`);
      toast.success('Org Deleted Successfully');
      console.log(del);
    } catch (error) {
      toast.error('Error in Deleting Org');
      console.log(error);
    } finally {
      setPopupOpen(false);
    }
    getData();
  };

  const enableDisable = async () => {
    try {
      console.log('tha', status);

      status
        ? await axiosInstance.patch(`/organizations/${organizationId}`, {
            status: 3,
          })
        : await axiosInstance.patch(`/organizations/${organizationId}`, {
            status: 1,
          });
    } catch (error) {
      console.log(error);
    } finally {
      setEnablePopup(false);
    }
    getData();
  };

  const closePopup = () => {
    setPopupOpen(false);
    setEnablePopup(false);
  };

  const handleClick = () => {
    router.push('firm/add-update');
  };

  const getData = async () => {
    try {
      await axiosInstance.get('/organizations').then((response) => {
        const data = response.data;
        console.log(data);
        setRowData(data);
      });
    } catch (error) {
      console.log(error);
    }
  };
  console.log('data', status);

  return (
    <div>
      <h3 className="text-2xl text-center mb-5 mt-5">FIRMS</h3>
      <ConfirmationModal
        isOpen={popupOpen}
        onClose={closePopup}
        title="Confirm Delete"
        bodyText="Are you sure you want to delete this Organization?"
        deleteButtonText="Delete"
        cancelButtonText="Cancel"
        onButtonClick={confirmDelete}
      />
      <ConfirmationModal
        isOpen={enablePopup}
        onClose={closePopup}
        title="Enable / Disable"
        bodyText={
          status
            ? 'Are you sure you want to disable this Organization'
            : 'Are you sure you want to enable this Organization?'
        }
        deleteButtonText={status ? 'Disable' : 'Enable'}
        cancelButtonText="Cancel"
        onButtonClick={enableDisable}
      />
      <div>
        <AgGridComponent rowData={rowData} columnDefs={columnDefs} />
      </div>

      <button
        type="submit"
        className=" text-center p-3 rounded bg-cyan-500 text-black float-right mt-3 mr-4"
        onClick={handleClick}
      >
        ADD ORGANIZATION
      </button>
    </div>
  );
};

export default Admin;
