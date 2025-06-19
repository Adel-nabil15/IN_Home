import mongoose from "mongoose";
import UserModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/Error/index.js";
import { ComparePass, HACH } from "../../utils/Hash/index.js";
import { GeneratToken } from "../../utils/token/index.js";

// ----------------------- SignUp -----------------------
export const SignUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, Cpassword, phone, address } = req.body;
  const checkUser = await UserModel.findOne({ email });
  if (checkUser) return next(new Error("email already exists", { cause: 409 }));
  if (password !== Cpassword) {
    return next(new Error("password not match", { cause: 400 }));
  }
  const hashedPassword = await HACH(password, parseInt(process.env.SOLT));
  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
  });
  res.status(200).json({ message: "success", user: newUser });
});

// ----------------------- confirmEmailBySuperAdmin -----------------------
export const confirmEmailBySuperAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const checkUser = await UserModel.findOne({
    email,
    role: "pending",
    confirmed: false,
  });
  if (!checkUser)
    return next(
      new Error("email not found or already confirmed or not pending", {
        cause: 409,
      })
    );
  if (checkUser.confirmed) {
    return next(new Error("email already confirmed", { cause: 409 }));
  }
  await UserModel.findOneAndUpdate(
    { email },
    { confirmed: true, role: "admin" },
    { new: true }
  );
  res.status(200).json({ message: "email confirmed successfully" });
});

// ----------------------- login -----------------------
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const checkUser = await UserModel.findOne({
    email,
    confirmed: true,
    isFreezed: { $exists: false },
    role: { $in: ["admin", "superadmin"] },
  });
  if (!checkUser) {
    return next(
      new Error(
        "email not found or not confirmed or youare not admin or not superadmin ",
        { cause: 409 }
      )
    );
  }
  const match = await ComparePass(password, checkUser.password);
  if (!match) next(new Error("password not match", { cause: 409 }));

  const token = await GeneratToken({
    payload: {
      id: checkUser._id,
      role: checkUser.role,
      email: checkUser.email,
    },
    SEGNETURE:
      checkUser.role == "admin"
        ? process.env.SEGNETURE_ADMIN
        : process.env.SEGNETURE_SUPERADMIN,
  });
  if (!token) {
    return next(new Error("there is wrong in token", { cause: 400 }));
  }
  res.status(200).json({ message: "success", token });
});

// ----------------------- GetProfile -----------------------
export const GetProfile = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({
    email: req.user.email,
    confirmed: true,
  }).select("name email role phone address confirmed ");
  res.status(200).json({ message: "done", user });
});

// ----------------------- UpdateProfile -----------------------
export const UpdateProfile = asyncHandler(async (req, res, next) => {
  const newUser = await UserModel.findOneAndUpdate(
    { email: req.user.email, confirmed: true },
    req.body,
    { new: true }
  ).select("name email role phone address ");
  res.status(200).json({ message: "done", user: newUser });
});

// ----------------------- UpdatePassword -----------------------
export const UpdatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!(await UserModel.findOne({ email: req.user.email, confirmed: true }))) {
    return next(new Error("email not found or not confirmed", { cause: 409 }));
  }
  const ComparePassword = await ComparePass(oldPassword, req.user.password);
  if (!ComparePassword) {
    return next(new Error("old password not match", { cause: 409 }));
  }
  if (oldPassword === newPassword) {
    return next(new Error("new password must be different", { cause: 400 }));
  }
  const Hpass = await HACH(newPassword, parseInt(process.env.SOLT));

  const newUser = await UserModel.findOneAndUpdate(
    { email: req.user.email, confirmed: true },
    { password: Hpass },
    { new: true }
  ).select("name email role phone address ");
  res.status(200).json({ message: "password updated successfully" });
});

// ----------------------- FreazUserBySuperAdmin -----------------------
export const FreazUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!(await UserModel.findOne({ _id: id, confirmed: true }))) {
    return next(new Error("user not found or not confirmed", { cause: 404 }));
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new Error("Invalid user ID", { cause: 400 }));
  }
  if (req.user._id == id) {
    return next(new Error("you can't freezed yourself", { cause: 400 }));
  }
  const user = await UserModel.findOne({ _id: id, confirmed: true });
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  await UserModel.findOneAndUpdate(
    { _id: id, confirmed: true },
    { isFreezed: true, confirmed: false },
    { new: true }
  );
  res.status(200).json({ message: "user freezed successfully" });
});
