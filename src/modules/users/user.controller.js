import Router from "express";
const UserRouter = Router();
import {
  SignUp,
  login,
  GetProfile,
  UpdateProfile,
  UpdatePassword,
  FreazUser,
  confirmEmailBySuperAdmin,
} from "./user.service.js";
import { Authentication, Authorization } from "../../middleware/Auth.js";
import { validation } from "../../middleware/validation.js";
import {
  SignUpSchema,
  confirmEmailBySuperAdminSchema,
  loginSchema,
  UpdateProfileSchema,
  UpdatePasswordSchema,
} from "./user.validation.js";

UserRouter.post("/SignUp", validation(SignUpSchema), SignUp);
UserRouter.patch(
  "/confirmEmailBySuperAdmin",
  validation(confirmEmailBySuperAdminSchema),
  Authentication,
  Authorization(["superadmin"]),
  confirmEmailBySuperAdmin
);
UserRouter.post("/login", validation(loginSchema), login);
UserRouter.post(
  "/GetProfile",
  Authentication,
  Authorization(["admin", "superadmin"]),
  GetProfile
);
UserRouter.patch(
  "/UpdateProfile",
  validation(UpdateProfileSchema),
  Authentication,
  Authorization(["admin", "superadmin"]),
  UpdateProfile
);
UserRouter.patch(
  "/UpdatePassword",
  validation(UpdatePasswordSchema),
  Authentication,
  Authorization(["admin", "superadmin"]),
  UpdatePassword
);
UserRouter.delete(
  "/FreazUser/:id",
  Authentication,
  Authorization(["superadmin"]),
  FreazUser
);

export default UserRouter;
