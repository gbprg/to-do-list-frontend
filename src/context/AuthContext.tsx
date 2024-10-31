"use client";

import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import api from "@/services/api";
import { User } from "@/interfaces/user-interface";

type SignInCredentials = {
  email: string;
  password: string;
};

export type AuthContextData = {
  user: User | undefined;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function signOut() {
  destroyCookie(undefined, "token");
  destroyCookie(undefined, "refreshToken");

  window.location.href = "/";
}

interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "token": token } = parseCookies();

    if (token) {
      api
        .get<AuthenticatedUser>("/users/me")
        .then((response) => {
          const { id, name, email } = response.data;

          setUser({ id, name, email });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/auth/login", { email: email.trim(), password: password.trim() });
      const { id, name } = response.data.user;
      const { token, refreshToken } = response.data;

      setCookie(undefined, "token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setCookie(undefined, "refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setUser({ id, name, email });

      sessionStorage.setItem("token.user", JSON.stringify({ id, name, email }));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      window.location.href = "/home";
    } catch (error: unknown) {
      if (error instanceof Error)
        console.error("Erro ao fazer a requisição:", error.message);
    }
  }

  const authValue = useMemo(() => {
    return {
      signIn,
      user,
      isAuthenticated,
      signOut,
    };
  }, [signIn, user, isAuthenticated]);

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

export { AuthProvider };
