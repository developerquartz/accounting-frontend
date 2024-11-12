'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import axios from 'axios';

export default function DescriptionDialog({ bodyText, onSave, billDetail }) {
  let [isOpen, setIsOpen] = useState(true);
  const [saveDes, setSaveDes] = useState('');

  function closeModal() {
    setIsOpen(false);
  }

  async function handleSave() {
    const url = `http://localhost:3001/bill/${billDetail}`;
    console.log(url);
    await axios
      .patch(url, {
        description: saveDes,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    closeModal();
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add Description
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{bodyText}</p>
                  </div>

                  <div className="mt-4">
                    <textarea
                      value={saveDes}
                      onChange={(e) => setSaveDes(e.target.value)}
                      className="w-full"
                    />
                    <div className="flex flex-row">
                      <button
                        type="button"
                        className=" rounded-md border border-transparent bg-blue-100 px-4 py-2 mr-4 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleSave}
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        className="  rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

// import { useState } from "react";
// import { Dialog } from "@headlessui/react";

// const DescriptionDialog = ({ bodyText, onSave }) => {
//   let [isOpen, setIsOpen] = useState(true);
//   const [desc, setDesc] = useState("");

//   const handleSave = () => {
//     onSave(desc);
//   };

//   return (
//     <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
//       <Dialog.Panel>
//         <Dialog.Title>Add Description</Dialog.Title>
//         <Dialog.Description>
//           <textarea
//             rows="4"
//             cols="50"
//             value={desc}
//             onChange={(e) => setDesc(e.target.value)}
//           />
//         </Dialog.Description>

//         <button onClick={handleSave}>Save</button>
//         <button onClick={() => setIsOpen(false)}>Cancel</button>
//       </Dialog.Panel>
//     </Dialog>
//   );
// };
