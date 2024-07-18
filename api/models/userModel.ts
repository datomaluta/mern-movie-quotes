import mongoose, { Document, Model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser extends Document {
  username: string;
  email: string;
  image: string;
  password: string;
  passwordConfirm: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  verifyToken: string | undefined;
  verifyTokenExpires: Date | Number | undefined;
  verified: boolean;
  createVerifyToken: () => string;
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username field is required"],
    minLength: 4,
    maxLength: 15,
    validate: {
      validator: function (v: string) {
        return /^[a-z]+$/.test(v);
      },
      message: (props: any) =>
        `${props.value} is not a valid username! Only lowercase English letters are allowed.`,
    },
  },
  email: {
    type: String,
    required: [true, "Email field is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDwmG52pVI5JZfn04j9gdtsd8pAGbqjjLswg&s",
  },
  password: {
    type: String,
    required: [true, "Password field is required"],
    minLength: 4,
    maxLength: 15,
    select: false,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9]+$/.test(v);
      },
      message: () =>
        `This value is not a valid password! Only English letters and numbers are allowed.`,
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (this: IUser, el: string): boolean {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  verifyToken: String,
  verifyTokenExpires: Date,
  verified: {
    type: Boolean,
    default: false,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.createVerifyToken = function (this: IUser) {
  const verifyToken = crypto.randomBytes(32).toString("hex");

  this.verifyToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  this.verifyTokenExpires = Date.now() + 10 * 60 * 1000;

  return verifyToken;
};

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
