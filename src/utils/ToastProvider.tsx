"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";
import Toast from "../app/components/Toats";

export interface ToastContextType {
  showToast: (message: string, type: "success" | "error") => void;
}

export interface ToastProviderProps {
  children: ReactNode;
}

// Crea il contesto per il Toast
export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

// Provider per il contesto
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
