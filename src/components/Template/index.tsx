"use client";

import { ReactNode, useEffect } from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMounted } from "@/hooks/useMounted";

interface ITemplate {
  children: ReactNode;
}

export const Template = ({ children }: ITemplate) => {
  const router = useRouter();
  const isMounted = useMounted();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (isMounted()) {
        if (!user?.id) {
          const timer = setTimeout(() => {
            return router.push("/login", {});
          }, 1000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [isAuthenticated, isMounted, router, user?.id]);

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="pb-20 mx-auto w-full flex-grow">{children}</div>
        <Footer />
      </div>
    </>
  );
};
