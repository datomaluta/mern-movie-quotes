import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { sendEmail } from "../utils/email";
import { AppError } from "../utils/appError";
import crypto from "crypto";
import path from "path";
import ejs from "ejs";

interface UserDocument extends Document {
  _id: string;
  username: string;
  email: string;
  password: string | undefined;
  passwordConfirm: string;
}

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (
  user: UserDocument,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.confirm_password,
  });

  // Generate the random verify token
  const verifyToken = newUser.createVerifyToken();
  await newUser.save({ validateBeforeSave: false });

  const verifyURL = `${process.env.CLIENT_URL}/verify/${verifyToken}`;

  const emailTemplatePath = path.join(
    __dirname,
    "..",
    "views",
    "verifyUser.html"
  );

  ejs.renderFile(
    emailTemplatePath,
    { name: newUser.username, link: verifyURL },
    async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      try {
        await sendEmail({
          email: newUser.email,
          subject: "Welcome to Movie Quotes",
          html: data,
        });

        res.status(200).json({
          status: "success",
          message: "Verify Token sent to email",
        });
      } catch (error) {
        newUser.verifyToken = undefined;
        newUser.verifyTokenExpires = undefined;
        await newUser.save({ validateBeforeSave: false });

        return next(new AppError("Email could not be sent", 500));
      }
    }
  );
});

export const verifyUser = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.verifyToken)
    .digest("hex");

  const user = await User.findOne({
    verifyToken: hashedToken,
    verifyTokenExpires: { $gt: Date.now() },
  });

  // 2) if token has not expired and there is user, activate user account
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.verified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(user as any, 200, req, res);
});
