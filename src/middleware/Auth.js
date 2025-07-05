import UserModel from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/Error/index.js";
import { VerifyToken } from "../utils/token/index.js";

// Authentication middleware for all routes
export const Authentication = asyncHandler(async (req, res, next) => {
  // get authorization from header
  const { authorization } = req.headers;
  // check if authorization is exist
  if (!authorization) {
    return next(new Error("authorization is required", { cause: 401 }));
  }
  // split authorization to prefix and token
  const [prefix, token] = authorization.split(" ");
  // check if prefix and token are exist
  if (!prefix || !token) {
    return next(new Error("authorization is required", { cause: 401 }));
  }
  // get token from header
  let TOKEN = undefined;
  if (prefix == "Bearer") {
    TOKEN = process.env.SEGNETURE_ADMIN;
  } else if (prefix == "Super") {
    TOKEN = process.env.SEGNETURE_SUPERADMIN;
  } else {
    return next(new Error("Error in prefix", { cause: 401 }));
  }
  // verify token
  const decoded = await VerifyToken(token, TOKEN);
  // check if token is valid or not
  if (!decoded?.email) {
    return next(new Error("Invalid token", { cause: 401 }));
  }
  // check if user is exist
  const user = await UserModel.findOne({ email: decoded.email, confirmed: true });
  if (!user) {
    return next(new Error("Not registerd user or not confirmed", { cause: 401 }));
  }
  // check if user is freezed
  if (user.isFreezed) {
    return next(new Error("Your account is freezed ", { cause: 401 }));
  }
  // check if user change password
  if (parseInt(user?.changeCredentialTime?.getTime() / 1000) > decoded.iat) {
    return next(
      new Error("token expired please login again", { cause: 400 })
    );
  }
  req.user = user;
  next();
});

// Authorization middleware for all routes
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
