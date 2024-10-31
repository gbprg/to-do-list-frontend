import { User } from "@/interfaces/user-interface";
import api from "@/services/api";
import { NextRequest, NextResponse } from "next/server";

type IUser = Omit<User, "id">;

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = request.body as unknown as IUser;
    const response = await api.post("/auth/register", { name, email, password });

    return NextResponse.json({ data: response.data })
  } catch (error) {
    console.log("Erro ao criar conta:", error);
    return NextResponse.json(
      {
        error: "Erro ao criar conta",
      },
      { status: 500 }
    );
  }
}