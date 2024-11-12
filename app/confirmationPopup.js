import React from "react";

const CustomModal = ({
  isOpen,
  onClose,
  title,
  bodyText,
  deleteButtonText,
  onButtonClick,
  cancelButtonText,
}) => {
  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className={`fixed top-0 left-0 right-0 z-50 ${
        isOpen ? "flex items-center justify-center" : "hidden"
      } p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen`}
    >
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button
          type="button"
          className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={onClose}
          data-modal-hide="popup-modal"
        >
          {/* Close button SVG here */}
        </button>
        <div className="p-6 text-center">
          <h3 className="mb-5 text-lg font-normal text-white dark:text-white">
            {title}
          </h3>
          <p className="text-white mb-4">{bodyText}</p>
          <button
            type="button"
            onClick={onButtonClick}
            data-modal-hide="popup-modal"
            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
          >
            {deleteButtonText}
          </button>
          <button
            type="button"
            onClick={onClose}
            data-modal-hide="popup-modal"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
