"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ColDef } from "ag-grid-community";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../../confirmationPopup.js";
import AgGridComponent from "@/app/grid.js";
import { toast } from "react-toastify";
import ImageViewer from "../../../imageViewer.js";
import axiosInstance from "@/app/axiosInstance.js";

export default function DisplayDoc({
  params,
}: {
  params: {
    docs: string;
  };
}) {
  const [rowData, setRowData] = useState<any>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [vaultId, setVaultId] = useState<any>(null);
  const [docPopUp, setDocPopUp] = useState(false);
  useEffect(() => {
    getData();
  }, []);
  console.log(params.docs);

  const columnDefs: ColDef[] = [
    // { headerName: "Name", field: "name.name" },
    { headerName: "Client", field: "clientId.name" },
    { headerName: "Year", field: "year" },
    { headerName: "Month", field: "month" },
    { headerName: "Quarter", field: "quarter" },
    { headerName: "Remarks", field: "remarks" },
    {
      headerName: "Action",
      field: "actions",
      cellRenderer: (params: any) => (
        <div>
          <button onClick={() => onEditClick(params)}>
            <FontAwesomeIcon icon={faEye} />
          </button>

          <button className="ml-3 mr-3" onClick={() => onDeleteClick(params)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>

          {/* <button className="ml-3" onClick={() => onDownload(params)}>
            <FontAwesomeIcon icon={faDownload} />
          </button> */}
          <a href={params.data.fileLink} download>
            <FontAwesomeIcon icon={faDownload} />
          </a>
        </div>
      ),
    },
  ];
  const router = useRouter();
  const onEditClick = async (params: any) => {
    console.log(params.data._id);
    setVaultId(params.data);
    setDocPopUp(true);
  };

  const onDeleteClick = async (params: any) => {
    console.log(params.data._id);
    setVaultId(params.data._id);
    setPopupOpen(true);
  };

  const onDownload = async (params: any) => {
    try {
      const downloadUrl = params.data.fileLink;
      // const downloadUrl = "/doc.pdf";
      console.log("url", downloadUrl);

      return <a href={downloadUrl} download />;
      // const link = document.createElement("a");
      // console.log("ink", link);
      // link.href = downloadUrl;
      // link.style.display = "none";
      // link.setAttribute("download", "");
      // document.body.appendChild(link);
      // console.log("final", link);

      // link.click();
      // console.log(link);
      // document.body.removeChild(link);
      // if (typeof window !== "undefined") {
      //   window.location.href = downloadUrl;
      // }
    } catch (error) {
      console.error(error);
    }
  };

  console.log("id", params.docs[0]);

  const confirmDelete = async () => {
    try {
      const del = await axiosInstance.patch(`/vaults/${vaultId}`, {
        deleteStatus: 2,
      });
      toast.success("User Deleted Successfully");
      console.log(del);
    } catch (error) {
      toast.error("Error in Deleting User");
      console.log(error);
    } finally {
      setPopupOpen(false);
    }
    getData();
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const onImgClose = () => {
    setDocPopUp(false);
  };

  const getData = async () => {
    await axiosInstance
      .get("/vaults", {
        params: {
          clientId: params.docs[0],
          name: params.docs[1],
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        // const filteredData = data.filter(
        //   (item: any) => item.deleteStatus !== 2
        // );

        setRowData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h3 className="text-2xl text-center mb-5 mt-5">VAULT</h3>
      <ConfirmationModal
        isOpen={popupOpen}
        onClose={closePopup}
        title="Confirm Delete"
        bodyText="Are you sure you want to delete this Document?"
        deleteButtonText="Delete"
        cancelButtonText="Cancel"
        onButtonClick={confirmDelete}
      />
      <ImageViewer
        isOpen={docPopUp}
        bodyText={vaultId?.fileLink}
        docType={vaultId?.fileType}
        isClose={onImgClose}
      />
      <div>
        <AgGridComponent rowData={rowData} columnDefs={columnDefs} />
      </div>
    </div>
  );
}
