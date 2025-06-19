import UserModel from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/Error/index.js";
import { VerifyToken } from "../utils/token/index.js";

export const Authentication = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new Error("authorization is required", { cause: 401 }));
  }
  const [prefix, token] = authorization.split(" ");
  if (!prefix || !token) {
    return next(new Error("authorization is required", { cause: 401 }));
  }
  let TOKEN = undefined;
  if (prefix == "Bearer") {
    TOKEN = process.env.SEGNETURE_ADMIN;
  } else if (prefix == "Super") {
    TOKEN = process.env.SEGNETURE_SUPERADMIN;
  } else {
    return next(new Error("Error in prefix", { cause: 401 }));
  }

  const decoded = await VerifyToken(token, TOKEN);
  console.log("ddd");

  if (!decoded?.email) {
    return next(new Error("Invalid token", { cause: 401 }));
  }

  const user = await UserModel.findOne({ email: decoded.email });
  if (!user) {
    return next(new Error("Not registerd user", { cause: 401 }));
  }
  if (user.isFreezed) {
    return next(new Error("Your account is freezed", { cause: 401 }));
  }
  req.user = user;
  next();
});

export const Authorization = (RoleType) => {
  return asyncHandler(async (req, res, next) => {
    if (!RoleType.includes(req.user.role)) {
      return next(
        new Error("you are not allowed to access this option", { cause: 401 })
      );
    }
    next();
  });
};
