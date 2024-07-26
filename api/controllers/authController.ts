import User, { IUser } from "../models/userModel";
import { catchAsync } from "../utils/catchAsync";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { sendEmail } from "../utils/email";
import { AppError } from "../utils/appError";
import crypto from "crypto";
import path from "path";
import ejs from "ejs";
import shortid from "shortid";
import { promisify } from "util";
import { CustomRequest } from "../types";

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

export const signin = catchAsync(async (req, res, next) => {
  // 1) get email and password from request body
  const { email_or_username: emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return next(new AppError(req.t("emailAndUsernameRequired"), 400));
  }

  // 2) check if user exists, user is verified and password is correct (email also used as username)
  let user: IUser | null = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  }).select("+password +verified");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(req.t("incorrectCredentials"), 401));
  }

  if (!user.verified) {
    return next(new AppError("Please verify your account first!", 401));
  }

  // 3) if everything ok, send token to client
  createSendToken(user as any, 200, req, res);
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on posted email

  const user: IUser | null = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }

  // 2) generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user's email
  const resetURL = `${process.env.CLIENT_URL}/?action=new-password&token=${resetToken}`;
  const emailTemplatePath = path.join(
    __dirname,
    "..",
    "views",
    "passwordReset.html"
  );

  ejs.renderFile(
    emailTemplatePath,
    { name: user.username, link: resetURL },
    async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      try {
        await sendEmail({
          email: user.email,
          subject: "Password reset (valid for 10 minutes)",
          html: data,
        });

        res.status(200).json({
          status: "success",
          message: "Password reset token sent to email",
        });
      } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError("Email could not be sent", 500));
      }
    }
  );
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user: IUser | null = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) if token has not expired and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.confirm_password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user as any, 200, req, res);
});

export const googleSignin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, googlePhotoUrl } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      createSendToken(user as any, 200, req, res);
    } else {
      const generateUsername = (name: string) => {
        const baseUsername = name
          .toLowerCase()
          .replace(/[^a-z]/g, "")
          .slice(0, 9);
        const shortId = shortid
          .generate()
          .replace(/[^a-z]/g, "")
          .slice(0, 6);
        return baseUsername + shortId;
      };

      const generatedUsername = generateUsername(username);

      const generatedPassword = `${
        Math.random().toString(36).slice(-7) +
        Math.random().toString(36).slice(-8)
      }`.replace(".", "");

      const newUser = new User({
        username: generatedUsername,
        email,
        password: generatedPassword,
        passwordConfirm: generatedPassword,
        image: googlePhotoUrl,
        verified: true,
        isGoogleUser: true,
      });

      await newUser.save();
      createSendToken(newUser as any, 200, req, res);
    }
  }
);

export const protect = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    token = req.cookies.jwt;
    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      iat: number;
    };
    // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    // 5) Grant access to protected route
    req.user = currentUser;
    next();
  }
);

export const updateMyPassword = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) get user from collection
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    // 2) check if POSTed current password is correct
    if (
      !(await user.correctPassword(req.body.current_password, user.password))
    ) {
      return next(new AppError("Your current password is wrong", 401));
    }

    // 3) if so, update password
    user.password = req.body.new_password;
    user.passwordConfirm = req.body.confirm_password;
    await user.save();

    // 4) log user in, send JWT
    createSendToken(user as any, 200, req, res);
  }
);

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
