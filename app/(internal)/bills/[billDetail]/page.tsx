"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useEffect, useState } from "react";
import axios from "axios";
import useKeyboardShortcut from "use-keyboard-shortcut";
import DescriptionDialog from "../../../descriptPopup";
import { toast } from "react-toastify";
import { BillData } from "./billDetail.interface";
import Cookies from "universal-cookie";
import axiosInstance from "@/app/axiosInstance";

export default function Page({
  params,
}: {
  params: {
    billDetail: string;
  };
}) {
  const [billData, setBillData] = useState<BillData[]>([]);
  const [manRemark, setManRemark] = useState("");
  const [accRemark, setAccRemark] = useState("");
  const [isPopUp, setIsPopUp] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    getData();
  }, [params.billDetail]);

  const getData = async () => {
    await axiosInstance
      .get(`bill/${params.billDetail}`)
      .then((resp) => {
        const data = resp.data.data;
        setBillData([data]);
        setAccRemark(data.accRemark);
        setManRemark(data.manRemark);
        console.log("abhi", data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onSave = async () => {
    await axios
      .patch(`bill/${params.billDetail}`, {
        manRemark: manRemark,
        accRemark: accRemark,
      })
      .then((resp) => {
        toast.success("Remarks Edited");
      })
      .catch((error) => {
        toast.error("Error in Editing Remarks");
        console.log(error);
      });
  };
  const cookies = new Cookies();
  const userRole = cookies.get("role");

  const onClear = async () => {
    await axios
      .patch(`bill/${params.billDetail}`, {
        manRemark,
        accRemark,
      })
      .then((resp) => {
        console.log(resp);
        toast.success("Remarks Removed");
      })
      .catch((error) => {
        toast.error("Error in Removing Remarks");
        console.log(error);
      });
  };

  const openPopup = () => {
    setIsPopUp(true);
  };
  const img = useKeyboardShortcut(
    ["Shift", "Q"],
    async (shortcutKeys) => {
      try {
        const response = await axiosInstance.patch(
          `http://localhost:3001/bill/${params.billDetail}`,
          {
            status: 1,
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    {
      overrideSystem: false,
      ignoreInputFields: false,
      repeatOnHold: false,
    }
  );
  console.log(billData);

  const handleSaveDescription = (newDescription: any) => {
    setDescription(newDescription);
  };

  useKeyboardShortcut(
    ["Shift", "K"],
    async (shortcutKeys) => {
      console.log("clicked...");
      openPopup();

      try {
        const response = await axiosInstance.patch(
          `bill/${params.billDetail}`,
          {
            status: 2,
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    {
      overrideSystem: false,
      ignoreInputFields: false,
      repeatOnHold: false,
    }
  );
  useKeyboardShortcut(
    ["Shift", "L"],
    async (shortcutKeys) => {
      console.log("hitted");
      openPopup();
      try {
        const response = await axiosInstance.patch(
          `bill/${params.billDetail}`,
          {
            status: 4,
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    {
      overrideSystem: true,
      ignoreInputFields: false,
      repeatOnHold: false,
    }
  );
  const renderData = billData[0];
  console.log("bill", billData);
  console.log("render", renderData);
  const imgUrl: any = renderData ? renderData.link : "";
  // const image: any = imgUrl?.imgUrl.split("?")[0];

  return (
    <div className="mt-5">
      {isPopUp && (
        <DescriptionDialog
          bodyText={description}
          onSave={handleSaveDescription}
          billDetail={params.billDetail}
        />
      )}

      {/* <div className="w-full px-4 pt-4 pb-6">
        <div className="w-full max-w-none rounded-2xl bg-zinc-300 p-2">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-medium text-black hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75">
                  <span>
                    {renderData
                      ? `Bill for ${renderData.client.name}`
                      : "Loading..."}
                  </span>

                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-black">
                  <div className="grid grid-cols-5 md:grid-cols-5 gap-1">
                    <span>
                      {renderData
                        ? `Client : ${renderData.client.name}`
                        : "Loading..."}
                    </span>

                    <span>
                      {renderData
                        ? `billType : ${renderData.billType.billName}`
                        : "Loading..."}
                    </span>
                    <span>
                      {renderData
                        ? `Status : ${Object.keys(StatusData).find(
                            (key) => StatusData[key] === renderData?.status
                          )}`
                        : "Loading..."}
                    </span>
                    <span>
                      {renderData
                        ? `Remarks : ${renderData.remarks}`
                        : "Loading..."}
                    </span>
                    <span>
                      {renderData
                        ? `Suggestions : ${renderData.suggestions}`
                        : "Loading..."}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-10 pb-10">
                    <div>
                      <span>Accountant Remarks</span>
                      <textarea
                        id="message"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any remarks you would like to give..."
                        value={accRemark}
                        onChange={(e) => setAccRemark(e.target.value)}
                        readOnly={userRole !== 2}
                      ></textarea>
                    </div>
                    <div>
                      <span>Manager Remarks</span>
                      <textarea
                        id="message"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any remarks you would like to give..."
                        value={manRemark}
                        onChange={(e) => setManRemark(e.target.value)}
                        readOnly={userRole !== 1}
                      ></textarea>
                    </div>
                    <div>
                      <button
                        className=" p-3 rounded bg-cyan-500 text-black ml-5"
                        onClick={() => onSave()}
                      >
                        Save Remarks
                      </button>
                      <button
                        className=" p-3 rounded bg-cyan-500 text-black ml-5"
                        onClick={() => onClear()}
                      >
                        Clear Remarks
                      </button>
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div> */}
      <div>
        <iframe src={imgUrl} width="1400" height="650"></iframe>
      </div>
    </div>
  );
}
