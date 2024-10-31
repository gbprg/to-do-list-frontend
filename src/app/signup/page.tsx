"use client";
import { Input } from "@/components/Input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RouterApplication } from "@/services/routes";
import { toast } from "sonner";
import { useMounted } from "@/hooks/useMounted";

import { CustomError } from "@/interfaces/custom-error-interface";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";


const loginShema = z.object({
  name: z
    .string({ message: "Requer nome de usuário" })
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "O nome de usuário deve conter apenas letras, números, pontos e underlines, sem espaços ou acentuação"
    ),
  email: z
    .string()
    .email("O e-mail informado não é válido")
    .min(5, "O e-mail deve ter pelo menos 5 caracteres"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  repeatPassword: z
    .string({ message: "Requer repetir senha" })
    .min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
})
  .refine((data) => data.password === data.repeatPassword, {
    message: "As senhas devem coincidir",
    path: ["repeatPassword"],
  });
type loginFormData = z.infer<typeof loginShema>;

export default function Signup() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<loginFormData>({
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
    resolver: zodResolver(loginShema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const isMounted = useMounted();
  const { isAuthenticated } = useAuth();
  async function handleSubmitForm({
    name,
    email,
    password,
    repeatPassword,
  }: loginFormData) {
    try {
      if (password !== repeatPassword) {
        return;
      }

      await RouterApplication.signUp({
        name,
        email,
        password,
      });

      reset();

      toast.success("Sua conta foi criada com sucesso!.", {
        position: "top-right",
      });

      if (isMounted()) {
        router.push("/login");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const customError = error as CustomError;
        if (customError.response && customError.response.data) {
          toast.error(customError.response.data.error, {
            position: "top-right",
          });
        } else {
          toast.error(error.message, { position: "top-right" });
        }
      } else {
        toast.error("Ocorreu um erro inesperado. Tente novamente.", {
          position: "top-right",
        });
      }
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (isMounted()) {
        if (isAuthenticated) {
          router.push("/home");
        }
      }
    };

    checkAuth();
  }, [isMounted, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-radial p-4">
      <div className="bg-black bg-opacity-30 p-6 md:p-8 rounded-lg md:rounded-2xl shadow-lg max-w-sm w-full sm:max-w-md">
        <h2 className="text-white text-center text-xl md:text-2xl font-semibold mb-4 md:mb-6">
          To-do List
        </h2>

        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="mb-3 md:mb-4 text-black">
            <Input
              name="name"
              type="text"
              label="Nome do usuário"
              control={control}
              errors={errors}
            />
          </div>
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
              label="Senha"
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
          <div className="mb-3 md:mb-4 relative text-black">
            <Input
              control={control}
              name="repeatPassword"
              label="Confirmar Senha"
              type={showPassword ? "text" : "password"}
              errors={errors}
              format="text"
            />
          </div>


          <button
            type="submit"
            className="w-full bg-gray-800 bg-opacity-60 text-white p-2 md:p-3 rounded-md md:rounded-lg hover:bg-opacity-80 transition"
          >
            CADASTRAR
          </button>
          <p className="text-sm font-[700]">
            Já tem cadastro?{" "}
            <Link href={"/login"}>
              <span className="text-letter-bold">Logar-se</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}