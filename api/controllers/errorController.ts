import i18next from "i18next";
import { AppError } from "../utils/appError";
import { Request, Response, NextFunction } from "express";
import { Error } from "mongoose";

const handleCastErrorDB = (
  err: { path: string; value: string },
  req: Request
) => {
  const message = i18next.t("Invalid {{path}}: {{value}}.", {
    path: err.path,
    value: err.value,
    lng: req.language,
  });
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (
  err: { errorResponse: { errmsg: string } },
  req: Request
) => {
  const matchResult = err?.errorResponse?.errmsg?.match(/(["'])(\\?.)*?\1/);
  const value = matchResult && matchResult[0].replace(/["']/g, "");

  const message = i18next.t(
    `Duplicate field value: {{value}}. Please use another value!`,
    { value, lng: req.language }
  );
  return new AppError(message, 400);
};

const handleValidationErrorDB = (
  err: { errors: { [key: string]: { message: string } } },
  req: Request
) => {
  const errors = Object.values(err.errors).map((el: { message: string }) =>
    i18next.t(`validations.${el.message}`, { lng: req.language })
  );
  const message = i18next.t("Invalid input data. {{errors}}", {
    errors: errors.join(". "),
    lng: req.language,
  });
  return new AppError(message, 400);
};
const handleJWTError = (req: Request) =>
  new AppError(
    i18next.t("tokens.Invalid token. Please log in again!", {
      lng: req.language,
    }),
    401
  );

const handleJWTExpiredError = (req: Request) =>
  new AppError(
    i18next.t("tokens.Your token has expired! Please log in again.", {
      lng: req.language,
    }),
    401
  );

const sendErrorDev = (
  err: { statusCode: number; status: string; message: string; stack?: string },
  req: Request,
  res: Response
) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (
  err: {
    isOperational: boolean;
    status: string;
    message: string;
    statusCode: number;
  },
  req: Request,
  res: Response
) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: i18next.t("Something went very wrong!", { lng: req.language }),
  });
};

export const globalErrorHandler = (
  err: {
    isOperational?: boolean;
    statusCode?: number;
    status?: string;
    message?: string;
    code?: number;
    path?: string;
    value?: string;
  },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(
      err as {
        statusCode: number;
        status: string;
        message: string;
        stack?: string;
      },
      req,
      res
    );
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    error.message = err.message;

    if (err.constructor.name === "CastError")
      error = handleCastErrorDB(error as { path: string; value: string }, req);
    if (error.code === 11000)
      error = handleDuplicateFieldsDB(
        error as { errorResponse: { errmsg: string } },
        req
      );
    if (err.constructor.name === "ValidationError")
      error = handleValidationErrorDB(
        error as { errors: { [key: string]: { message: string } } },
        req
      );
    if (err.constructor.name === "JsonWebTokenError")
      error = handleJWTError(req);
    if (err.constructor.name === "TokenExpiredError")
      error = handleJWTExpiredError(req);

    sendErrorProd(
      error as {
        isOperational: boolean;
        status: string;
        message: string;
        statusCode: number;
      },
      req,
      res
    );
  }
};
