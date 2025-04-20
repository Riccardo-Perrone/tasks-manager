import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function InputCustom({ label, ...inputProps }: Props) {
  return (
    <div>
      <label className="block text-sm text-gray-700 font-bold">{label}</label>
      <input
        {...inputProps}
        value={inputProps.value ?? ""}
        className="mt-1 w-full border bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500"
      />
    </div>
  );
}

export default InputCustom;
