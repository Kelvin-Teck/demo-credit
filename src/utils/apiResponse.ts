interface ApiResponse<T = undefined> {
  status: "SUCCESS" | "ERROR";
  code: number;
  message: string;
  data?: T;
}

const sendError = (message: string, code: number): ApiResponse => {
  return {
    status: "ERROR",
    code,
    message,
  };
};

const sendSuccess = <T>(message: string, data?: T): ApiResponse<T> => {
  return {
    status: "SUCCESS",
    code: 200,
    message,
    data,
  };
};

// class CustomError extends Error {
//   status: number;

//   constructor(message: string, status: number) {
//     super(message);
//     this.status = status;
//     Object.setPrototypeOf(this, new.target.prototype);
//   }
// }

// utils/CustomError.ts
class CustomError extends Error {
  public code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = "CustomError";
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}


const newError = (message: string, code: number) => {
  throw new CustomError(message, code);
  // return {
  //   error: true,
  //   message,
  //   code,
  // };
};

export { sendError, sendSuccess, newError, CustomError };
