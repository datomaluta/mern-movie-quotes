import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import { CustomRequest } from "../types";

type AnyObject = { [key: string]: any };

const filterObj = (
  obj: AnyObject,
  ...allowedFields: string[]
): { [key: string]: any } => {
  const newObj: AnyObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.confirm_password) {
      return next(new AppError("This action is not for password update", 403));
    }

    const filteredBody = filterObj(req.body, "username", "email", "image");

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);
