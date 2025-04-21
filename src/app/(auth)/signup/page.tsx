"use client";
import React, { useState } from "react";
import InputCustom from "../../components/InputCustom";
import api from "@/src/lib/axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/utils/ToastProvider";
import Cookies from "js-cookie";

type SignUpType = {
  username: string;
  password: string;
};

function SignUp() {
  const [form, setForm] = useState<SignUpType>({ password: "", username: "" });
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user: SignUpType = {
      ...form,
    };
    try {
      const userLogged = await api.post("/users/signup", user);
      Cookies.set("user_id", userLogged.data.user.id);

      router.push("/");
    } catch (error) {
      showToast("Errora nella registrazione, riprovare", "error");
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
      <h2 className="text-2xl font-bold mb-4">Crea un nuovo account</h2>

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
        <a href="/login" className="text-xs">
          Hai gia' un account? Accedi qui!
        </a>
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-500 cursor-pointer"
          >
            SignUp
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
