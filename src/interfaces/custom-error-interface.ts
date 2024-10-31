export interface CustomError extends Error {
  response?: {
    data: {
      response: {
        data: {
          error: string;
        };
      };
      error: string;
    };
  };
}
