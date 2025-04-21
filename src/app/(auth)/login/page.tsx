"use client";
import React, { useState } from "react";
import InputCustom from "../../components/InputCustom";
import api from "@/src/lib/axios";
import { useToast } from "@/src/utils/ToastProvider";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type LoginType = {
  username: string;
  password: string;
};

function Login() {
  const [form, setForm] = useState<LoginType>({ password: "", username: "" });
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user: LoginType = {
      ...form,
    };
    try {
      const userLogged = await api.post("/users/login", user);
      Cookies.set("user_id", userLogged.data.user.id);

      router.push("/");
    } catch (error) {
      showToast("Errore nella login, riprovare", "error");
    }
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

        <a href="/signup" className="text-xs">
          Non hai un account? Registrati qui!
        </a>

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
