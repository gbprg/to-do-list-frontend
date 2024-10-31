import { User } from "@/interfaces/user-interface";
import api from "./api"

type IUser = Omit<User, "id">;

export const RouterApplication = {
  signUp: async (params: IUser) => {
    api.post('/auth/register', params)
  }
}