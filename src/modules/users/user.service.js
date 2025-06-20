import mongoose from "mongoose";
import UserModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/Error/index.js";
import { ComparePass, HACH } from "../../utils/Hash/index.js";
import { GeneratToken } from "../../utils/token/index.js";

// ----------------------- createUserByAdmin -----------------------

export const createUserByAdmin = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return next(new Error("Email already exists", { cause: 409 }));
  }
  // const hashedPassword = await HACH(password, parseInt(process.env.SOLT));
  const newUser = await UserModel.create({
    name,
    email,
    password,
    phone,
    address,
  });
  res.status(201).json({ message: "User created successfully", user: newUser });
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
  // check password
  if (checkUser.password !== password) {
    return next(new Error("password not match", { cause: 409 }));
  }
  // const match = await ComparePass(password, checkUser.password);
  // if (!match) next(new Error("password not match", { cause: 409 }));

  // generate token
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
  res.status(200).json({ message: "success", token, user: checkUser });
});

// ----------------------- GetProfile -----------------------
export const GetProfile = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({
    email: req.user.email,
    confirmed: true,
    isFreezed: { $exists: false },
  }).select("name email role phone address");
  res.status(200).json({ message: "done", user });
});

// ----------------------- UpdateProfile -----------------------
export const UpdateProfile = asyncHandler(async (req, res, next) => {
  const newUser = await UserModel.findOneAndUpdate(
    { email: req.user.email, confirmed: true, isFreezed: { $exists: false } },
    req.body,
    { new: true }
  ).select("name email role phone address");

  res.status(200).json({ message: "done", user: newUser });
});

// ----------------------- UpdatePassword --------------------------------
export const UpdatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.params;
  const user = await UserModel.findOne({ _id: id, confirmed: true });
  if (!user) {
    return next(new Error("user not found or not confirmed", { cause: 404 }));
  }
  // const ComparePassword = await ComparePass(oldPassword, user.password);
  // if (!ComparePassword) {
  //   return next(new Error("old password not match", { cause: 409 }));
  // }
  if (user.password !== oldPassword) {
    return next(new Error("old password not match", { cause: 409 }));
  }
  if (oldPassword === newPassword) {
    return next(new Error("new password must be different", { cause: 400 }));
  }
  // const Hpass = await HACH(newPassword, parseInt(process.env.SOLT));
  const newUser = await UserModel.findOneAndUpdate(
    { _id: id, confirmed: true },
    {
      password: newPassword,
      changeCredentialTime: Date.now(),
      updatedAt: Date.now(),
    },
    { new: true }
  ).select("name email role phone address password  updatedAt");
  res
    .status(200)
    .json({ message: "password updated successfully ", user: newUser });
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
