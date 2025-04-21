import React, { InputHTMLAttributes, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  endAdornment?: ReactNode;
}

function InputCustom({ label, endAdornment, ...inputProps }: Props) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-gray-700 font-bold">{label}</label>
      )}
      <div className="relative">
        <input
          {...inputProps}
          value={inputProps.value ?? ""}
          className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500"
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>
    </div>
  );
}

export default InputCustom;
