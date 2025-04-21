import React from "react";

interface Props {
  handleSubmit: (e: React.FormEvent) => void;
  handleClose: () => void;
  title: string;
  textConfirm: string;
  textCancel?: string;
  children: React.ReactNode;
}

function Modal({
  handleSubmit,
  handleClose,
  textConfirm,
  textCancel,
  title,
  children,
}: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
      <div className="bg-gray-200 p-6 rounded-lg w-full max-w-md shadow-lg relative m-2">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {children}
        <form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          className="space-y-4"
        >
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
            >
              {textCancel}
            </button>
            <button className="px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-500 cursor-pointer">
              {textConfirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
