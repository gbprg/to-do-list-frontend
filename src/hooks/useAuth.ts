import { AuthContext, AuthContextData } from "@/context/AuthContext";
import { useContext } from "react";

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  return context;
};
