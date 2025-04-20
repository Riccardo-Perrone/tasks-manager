"use client";
import React, { useState } from "react";
import InputCustom from "../../components/InputCustom";

type LoginType = {
  username: string;
  password: string;
};

function Login() {
  const [form, setForm] = useState<LoginType>({ password: "", username: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user: LoginType = {
      ...form,
    };
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (!name) return;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="bg-gray-200 p-6 rounded-lg w-full max-w-md shadow-lg relative m-2">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputCustom
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <InputCustom
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-500 cursor-pointer"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
