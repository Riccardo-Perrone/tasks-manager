import React, { useEffect } from "react";

interface Props {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      className={`fixed z-50 top-5 right-5 px-4 py-2 rounded-md shadow-lg transition-all ${
        type === "error" ? "bg-red-500" : "bg-green-500"
      } flex items-center`}
    >
      <span className="text-white text-sm font-bold">{message}</span>
      <button
        onClick={onClose}
        className="ml-3 text-white text-lg font-bold focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
