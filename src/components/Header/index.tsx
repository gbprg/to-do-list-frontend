"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@phosphor-icons/react";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  function handleOpen() {
    setOpen((prevOpen) => !prevOpen);
  }

  return (
    <header className="h-[3.5rem] flex items-center justify-between px-4 bg-white shadow-md">
      <h1 className="text-lg font-semibold text-gray-800">Sua Lista de Tarefas</h1>

      <div className="relative">
        <div
          className="flex items-center gap-2 p-2 bg-gray-100 rounded-full cursor-pointer"
          onClick={handleOpen}
        >
          <User size={24} className="text-gray-700" />
        </div>

        {open && (
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                signOut();
                setOpen(false);
                router.push("/login");
              }}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-t-md"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
