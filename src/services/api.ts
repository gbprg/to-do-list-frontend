import { signOut } from "@/context/AuthContext";
import { parseCookies, setCookie } from "nookies";
import axios, { AxiosError, AxiosInstance } from "axios";

interface ErrorResponseType {
  message: {
    code: string;
  };
}

interface FailedRequest {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}

let isRefreshing = false;
let failedRequestsQueue: FailedRequest[] = [];

function setupAPIClient(): AxiosInstance {
  let cookies = parseCookies();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  });

  api.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${cookies["todo-list.token"]}`;

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        const errorData = error.response.data as ErrorResponseType;

        if (errorData.message.code === "token.expired") {
          cookies = parseCookies();

          const { "todo-list.refreshToken": refreshToken } = cookies;
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            api
              .post("/refresh-token", { refreshToken: refreshToken })
              .then((response) => {
                const { token } = response.data;

                setCookie(undefined, "todo-list.token", token, {
                  maxAge: 60 * 60 * 27 * 30,
                  path: "/login",
                });

                setCookie(
                  undefined,
                  "todo-list.refreshToken",
                  response.data.refreshToken,
                  {
                    maxAge: 60 * 60 * 27 * 30,
                    path: "/login",
                  }
                );

                api.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${token}`;

                failedRequestsQueue.forEach((request) =>
                  request.onSuccess(token)
                );
                failedRequestsQueue = [];
              })
              .catch((err: AxiosError) => {
                failedRequestsQueue.forEach((request) =>
                  request.onFailure(err)
                );
                failedRequestsQueue = [];

                if (typeof window !== "undefined") {
                  signOut();
                }
              })
              .finally(() => {
                isRefreshing = false;
              });
          }
          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                if (!originalConfig?.headers) {
                  return;
                }
                originalConfig.headers["Authorization"] = `Bearer ${token}`;
                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        }

        if (typeof window !== "undefined") {
          signOut();
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}

export const api = setupAPIClient();
