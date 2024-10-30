"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/Input";
import Link from "next/link";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<LoginFormValues> = data => {
    console.log("Login data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-radial p-4">
      <div className="bg-black bg-opacity-30 p-6 md:p-8 rounded-lg md:rounded-2xl shadow-lg max-w-sm w-full sm:max-w-md">
        <h2 className="text-white text-center text-xl md:text-2xl font-semibold mb-4 md:mb-6">
          To-do List
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3 md:mb-4 text-black">
            <Input
              control={control}
              name="email"
              label="Email ID"
              type="text"
              errors={errors}
              format="text"
            />
          </div>

          <div className="mb-3 md:mb-4 relative text-black">
            <Input
              control={control}
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              errors={errors}
              format="text"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <p>Ocultar</p> : <p>Mostrar</p>}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-400 mb-4 md:mb-6">
            <Link href="/signup" className="hover:underline mb-2 sm:mb-0">Registrar</Link>
            <Link href="#" className="hover:underline">Esqueceu a Senha?</Link>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 bg-opacity-60 text-white p-2 md:p-3 rounded-md md:rounded-lg hover:bg-opacity-80 transition"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
