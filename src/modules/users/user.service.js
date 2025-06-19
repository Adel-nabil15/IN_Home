import UserModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/Error/index.js";
import { ComparePass, HACH } from "../../utils/Hash/index.js";
import { GeneratToken } from "../../utils/token/index.js";

// ----------------------- SignUp -----------------------
export const SignUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;
  const checkUser = await UserModel.findOne({ email });
  if (checkUser) return next(new Error("email already exists", { cause: 409 }));
  const hashedPassword = await HACH(password, parseInt(process.env.SOLT));
  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    joinedAt: new Date().toLocaleDateString("en-GB"),
  });
  res.status(200).json({ message: "success", user: newUser });
});

// ----------------------- login -----------------------
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const checkUser = await UserModel.findOne({ email, confirmed: true });
  if (!checkUser)
    next(new Error("email not found or not confirmed", { cause: 409 }));
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
  const user = await UserModel.findOne({ email: req.user.email }).select(
    "name email role phone address confirmed "
  );
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

// ----------------------- FreazUser -----------------------
export const FreazUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
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
