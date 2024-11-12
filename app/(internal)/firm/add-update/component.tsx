"use client";
import React, { SyntheticEvent, useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Listbox, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axiosInstance from "@/app/axiosInstance";

interface ComponentProps {
  id?: string;
}

const Component: React.FC<ComponentProps> = ({ id }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [selectedRange, setSelectedRange] = useState<any>("");
  const [pincode, setPincode] = useState<number>();
  const [contactPerson, setContactPerson] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [personContact, setPersonContact] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [personAddress, setPersonAddress] = useState("");
  const [personCity, setPersonCity] = useState("");
  const [personState, setPersonState] = useState("");
  const [personPincode, setPersonPincode] = useState<number | string>("");

  useEffect(() => {
    if (id) {
      getData();
    }
  }, []);

  const clientRange = [
    { id: 1, range: "1 - 20" },
    { id: 2, range: "20 - 40" },
    { id: 3, range: "40 - 60" },
    { id: 4, range: "60 - 80" },
    { id: 5, range: "80 - 100" },
  ];

  const getData = async () => {
    try {
      console.log("id", id);

      const Orgresponse = await axiosInstance.get(`/organizations/${id}`);
      const organizationData = Orgresponse.data;
      const contactPersonId = organizationData.contactPersonId;
      console.log(organizationData);

      const newRange = clientRange.find((client: any) => {
        return client.range === organizationData.totalClient;
      });
      console.log("new", newRange);
      setName(organizationData.name);
      setContact(organizationData.contact);
      setEmail(organizationData.email);
      setAddress(organizationData.address);
      setCity(organizationData.city);
      setState(organizationData.state);
      setPincode(organizationData.pincode);
      setSelectedRange(newRange);

      const Userresponse = await axiosInstance.get(`/users/${contactPersonId}`);
      console.log("Userid", contactPersonId);

      const UserData = Userresponse.data.data;
      console.log(UserData);

      setContactPerson(UserData.name);
      setPersonContact(UserData.contact);
      setPersonEmail(UserData.email);
      setUsername(UserData.username);
      setPersonAddress(UserData.address);
      setPersonCity(UserData.city);
      setPersonState(UserData.state);
      setPersonPincode(UserData.pincode);
    } catch (error) {
      console.log(error);
    }
    console.log("newRange", selectedRange);
  };
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const requestData = {
        name,
        totalClient: selectedRange.range,
        contact,
        email,
        address,
        city,
        state,
        pincode,
      };
      let response;
      if (id) {
        console.log("i m in if", id);
        response = await axiosInstance.patch(
          `/organizations/${id}`,
          requestData
        );

        const userRes = response.data;
        const userId = userRes.contactPersonId;
        console.log("new", userId);

        response = await axiosInstance
          .patch(`/users/${userId}`, {
            name: contactPerson,
            totalClient: selectedRange.range,
            email: personEmail,
            contact: personContact,
            username,
            address: personAddress,
            city: personCity,
            state: personState,
            pincode: personPincode,
            userDelete: true,
          })
          .then((res) => {
            toast.success("Organization Successfully Updated");
            router.push("/firm");
          })
          .catch((error) => {
            toast.error("Error in Updating Organization");
            console.log(error);
          });
      } else {
        const orgResponse = await axiosInstance.post(
          "/organizations",
          requestData
        );

        const orgData = orgResponse.data;
        console.log(orgData);

        const orgId = orgData._id;
        console.log(orgId);

        toast.success("Organization Created Successfully");
        const contactPersonData = {
          name: contactPerson,
          email: personEmail,
          contact: personContact,
          organizationId: orgId,
          role: 1,
          username,
          password,
          address: personAddress,
          city: personCity,
          state: personState,
          pincode: personPincode,
        };

        const saveUser = await axiosInstance.post(
          "/users/signup",
          contactPersonData
        );

        const updateOrgData = await axiosInstance.patch(
          `/organizations/${orgId}`,
          {
            contactPersonId: saveUser.data.data._id,
          }
        );
        router.push("/firm");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    router.push("/firm");
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl text-center text-black p-4 m-4">
          {id ? "Update Firm" : "Register Firm"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4">
            <label className="text-black">Firm Name</label>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
              name="name"
              placeholder="Firm Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="p-4">
            <label className="text-black">No. of Clients</label>
            <Listbox value={selectedRange} onChange={setSelectedRange}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">
                    {selectedRange?.range || "Total Clients"}
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
                    {clientRange.map((item: any) => (
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
                              {item.range}
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
                    {selectedRange && (
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
        <div className="border-t-4 border-t-pink-900">
          <h1 className="text-3xl text-center text-black p-4 m-4">
            {id ? "Update Contact Person" : "Register Contact Person"}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="bg-white p-4">
              <label className="text-black">Email</label>
              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
                name="Contact Person"
                placeholder="Email"
                value={personEmail}
                onChange={(e) => setPersonEmail(e.target.value)}
              />
            </div>
            <div className="bg-white p-4">
              <label className="text-black">Contact</label>
              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
                name="Contact Person"
                placeholder="Contact"
                value={personContact}
                onChange={(e) => setPersonContact(e.target.value)}
              />
            </div>
            <div className="bg-white p-4">
              <label className="text-black">Username</label>
              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {!id && (
              <div className="bg-white p-4">
                <label className="text-black">Password</label>
                <input
                  type="text"
                  className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
                  name="Password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
            <div className="bg-white p-4">
              <label className="text-black">Address</label>
              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
                placeholder="Address"
                value={personAddress}
                onChange={(e) => setPersonAddress(e.target.value)}
              />
            </div>
            <div className="bg-white p-4">
              <label className="text-black">City</label>
              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
                placeholder="City"
                value={personCity}
                onChange={(e) => setPersonCity(e.target.value)}
              />
            </div>
            <div className="bg-white p-4">
              <label className="text-black">State</label>
              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
                placeholder="State"
                value={personState}
                onChange={(e) => setPersonState(e.target.value)}
              />
            </div>

            <div className="bg-white p-4">
              <label className="text-black">Pincode</label>
              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4 text-black"
                placeholder="Pincode"
                value={personPincode || ""}
                onChange={(e) => setPersonPincode(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className=" text-center p-3 rounded bg-cyan-500 text-black float-right mt-3 mr-4"
        >
          {id ? "Update" : "Add"}
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
