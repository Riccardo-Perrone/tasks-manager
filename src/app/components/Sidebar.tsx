"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaTasks } from "react-icons/fa";
import Modal from "./Modal";
import InputCustom from "./InputCustom";
import api from "@/src/lib/axios";
import { useToast } from "@/src/utils/ToastProvider";
// icons
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { IoMdHome } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";

import { Projects } from "@/src/utils/types";
import { statusToLabel } from "@/src/utils/statusToLabel";
import Link from "next/link";

function Sidebar() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");

  const [projects, setProjects] = useState<Projects[]>([]);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    try {
      const response = await api.get<Projects[]>("/projects");
      setProjects(response.data);
    } catch (error) {
      showToast(`Errore nel raccoglimnto dati progetti.`, "error");
    }
  };

  const handleLogout = () => {
    Cookies.remove("user_id");
    router.push("/login");
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/projects", {
        name: projectName.toLowerCase().replaceAll(" ", "-"),
      });
      setProjectName("");
      setShowModal(false);
      getProjects();
    } catch (error) {
      showToast(`Errore creazione progetto, Riprovare`, "error");
    }
  };

  return (
    <>
      {showModal && (
        <Modal
          handleClose={() => setShowModal(false)}
          handleSubmit={createProject}
          textConfirm="Crea"
          textCancel="Annulla"
          title="Crea un nuovo progetto"
        >
          <InputCustom
            label="Nome del progetto"
            value={projectName}
            onChange={(e) => {
              const value = e.target.value;
              const isValid = /^[A-Za-z\s]*$/.test(value);
              if (isValid) setProjectName(value);
            }}
          />
        </Modal>
      )}

      <div
        className={`flex-none fixed z-5 top-0 left-0 max-lg:h-full bg-gray-200 transition-all duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 ${
            sidebarCollapsed ? "lg:w-16" : "lg:w-40"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-2.5 py-3 border-b">
            <Link href="/">
              <span className="font-bold text-lg truncate">
                {sidebarCollapsed ? <IoMdHome /> : "!Jira"}
              </span>
            </Link>
            <div className="flex gap-2">
              {/* Collapse button (desktop only) */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:inline text-gray-500 hover:text-black"
              >
                {sidebarCollapsed ? (
                  <IoIosArrowDroprightCircle />
                ) : (
                  <IoIosArrowDropleftCircle />
                )}
              </button>
              {/* Close button (mobile only) */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="mt-4 space-y-2 px-2">
            <div className="mt-4 space-y-2 px-2 max-h-200 overflow-auto">
              {projects.map((element) => (
                <Link
                  key={element.id}
                  href={`/dashboard/${element.id}`}
                  className={`block px-3 py-2 rounded-md hover:bg-white text-sm ${
                    id === element.id ? "bg-white font-bold" : ""
                  }`}
                >
                  {sidebarCollapsed ? (
                    <FaTasks />
                  ) : (
                    <span className="text-wrap break-words">
                      {statusToLabel(element.name)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="border border-gray-400 font-bold cursor-pointer w-full text-left px-3 py-2 rounded-md hover:bg-white text-sm"
            >
              {sidebarCollapsed ? <IoAddCircleOutline /> : "+ Crea progetto"}
            </button>
          </nav>

          <div className="mt-auto px-2 mb-4">
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full text-left px-3 py-2 rounded-md hover:bg-white text-sm"
            >
              {sidebarCollapsed ? <IoMdLogOut /> : "Logout"}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay + Top bar for mobile */}
      <div className="m-4 lg:hidden">
        <div
          className={`fixed inset-0 z-1 bg-black/50 transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-gray-600"
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold">Task Manager</h1>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
