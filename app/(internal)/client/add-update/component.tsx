"use client";
import React, { SyntheticEvent, useEffect, useState, Fragment } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Listbox, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { ManagerData } from "./client.interface";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axiosInstance from "@/app/axiosInstance";

interface ComponentProps {
  clientOp?: string;
}

const Component: React.FC<ComponentProps> = ({ clientOp }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [gst, setGst] = useState("");
  const [pan, setPan] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState<ManagerData>();
  const [pincode, setPincode] = useState<number>();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (clientOp && managers.length) {
      getClientData(clientOp);
    }
  }, [managers]);

  const getData = async () => {
    await axiosInstance
      .get("/users/managers")
      .then((response) => {
        setManagers(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getClientData = async (clientOp: string) => {
    try {
      console.log("clientOp", clientOp);

      const response = await axiosInstance.get(`/clients/${clientOp}`);
      const clientData = response.data.data;
      const managerId = clientData.manager;
      console.log("id is", managerId);
      console.log("managers", managers);

      const foundManager = managers.find((manager: any) => {
        console.log("2id", manager._id);

        return manager._id === managerId;
      });
      console.log("data", foundManager);

      setName(clientData.name);
      setContact(clientData.contact);
      setContactPerson(clientData.contactPerson);
      setEmail(clientData.email);
      setGst(clientData.gst);
      setPan(clientData.pan);
      setAddress(clientData.address);
      setCity(clientData.city);
      setState(clientData.state);
      setSelectedManager(foundManager);
      setPincode(clientData.pincode);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      let managerId = null;
      if (selectedManager) {
        managerId = selectedManager._id;
      }
      const requestData = {
        name,
        contact,
        contactPerson,
        email,
        gst,
        pan,
        address,
        city,
        state,
        manager: managerId,
        pincode,
      };
      let response;

      if (clientOp) {
        console.log("i m in if", clientOp);
        response = await axiosInstance
          .patch(`/clients/${clientOp}`, requestData)
          .then((res) => {
            toast.success("Client Successfully Updated");
          })
          .catch((error) => {
            toast.error("Error in Updating Client");
            console.log(error);
          });
      } else {
        response = await axiosInstance
          .post("/clients", requestData)
          .then((response) => {
            console.log(response.data);
            router.push("/client");
            toast.success("Client Created Successfully");
          })
          .catch((error) => {
            toast.error("Error in Creating Client");
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("state", selectedManager);

  const handleClick = () => {
    router.push("/user");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl text-center text-black p-4 m-4">
          {clientOp ? "Update Client" : "Register Client"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4">
            <label className="text-black">Manager Assigned</label>
            <Listbox value={selectedManager} onChange={setSelectedManager}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">
                    {selectedManager?.name || "No Manager Assigned"}
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
                    {managers.map((item: any) => (
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
                        {/* className="text-black" */}
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
                    ))}
                    {selectedManager && (
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
          <div className="bg-white p-4">
            <label className="text-black">Company Name</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              name="name"
              placeholder="Company Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="bg-white p-4">
            <label className="text-black">Contact Person</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              name="Contact Person"
              placeholder="Contact Person"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4">
            <label className="text-black">Contact</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              name="Contact"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="bg-white p-4">
            <label className="text-black">E - Mail</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              name="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="bg-white p-4">
            <label className="text-black">GST No.</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              placeholder="GST No."
              value={gst}
              onChange={(e) => setGst(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4">
            <label className="text-black">PAN No.</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              placeholder="Pan No."
              value={pan}
              onChange={(e) => setPan(e.target.value)}
            />
          </div>
          <div className="bg-white p-4">
            <label className="text-black">Address</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="bg-white p-4">
            <label className="text-black">City</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4">
            <label className="text-black">State</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="bg-white p-4">
            <label className="text-black">Pincode</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(parseInt(e.target.value))}
            />
          </div>
        </div>

        <button
          type="submit"
          className=" text-center p-3 rounded bg-cyan-500 text-black float-right mt-3 mr-4"
        >
          {clientOp ? "Update Client" : "Add Client"}
        </button>
      </form>

      <button
        onClick={handleClick}
        className=" text-center p-3 rounded bg-cyan-500 text-black float-right mt-3 mr-4"
      >
        Cancel
      </button>
    </div>
  );
};

export default Component;
