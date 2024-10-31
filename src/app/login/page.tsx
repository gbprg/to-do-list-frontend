"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/Input";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMounted } from "@/hooks/useMounted";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { CustomError } from "@/interfaces/custom-error-interface";

const loginSchema = z.object({
  email: z
    .string()
    .min(3, "O campo de login deve ter pelo menos 3 caracteres")
    .refine(
      (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernamePattern = /^[a-zA-Z0-9._]+$/;

        return emailPattern.test(value) || usernamePattern.test(value);
      },
      {
        message: "Por favor, insira um e-mail válido ou nome de usuário válido",
      },
    ),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type loginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<loginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const { signIn, isAuthenticated } = useAuth();
  const isMounted = useMounted();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmitForm({ email, password }: loginFormData) {
    setLoading(true);
    try {
      await signIn({
        email: email,
        password: password,
      });

      if (isMounted()) {
        router.push("/home");
      }

      toast.success("Logado com sucesso!", {
        position: "top-right",
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        const customError = error as CustomError;
        toast.error(customError.response?.data.error, {
          position: "top-right",
        });
      }
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (isMounted() && isAuthenticated) {
        router.push("/home");
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
              disabled={loading}
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
            {!loading ? "ENTRAR" : "Carregando..."}
          </button>
        </form>
      </div>
    </div>
  );
}
