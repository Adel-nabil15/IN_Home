import Router from "express";
const UserRouter = Router();
import {
  createUserByAdmin,
  login, 
  GetProfile,
  UpdateProfile,
  UpdatePassword,
  FreazUser,
} from "./user.service.js";
import { Authentication, Authorization } from "../../middleware/Auth.js";
import { validation } from "../../middleware/validation.js";
import {
  loginSchema,
  UpdateProfileSchema,
  UpdatePasswordSchema,
  SignUpSchema,
} from "./user.validation.js";
// =============================== This Api of SuperAdmin =============================================
UserRouter.post("/createUserByAdmin",validation(SignUpSchema), Authentication,Authorization(["superadmin"]), createUserByAdmin);


// ===========================================================================
UserRouter.post("/login", validation(loginSchema) , login);
// ===========================================================================
UserRouter.post(
  "/GetProfile",
  Authentication,
  Authorization(["superadmin", "admin"]),
  GetProfile
);
// ===========================================================================
UserRouter.patch(
  "/UpdateProfile",
  validation(UpdateProfileSchema),
  Authentication,
  Authorization(["superadmin", "admin"]),
  UpdateProfile
);
// ================================ This Api of SuperAdmin ============================================
UserRouter.patch(
  "/UpdatePassword/:id",
  validation(UpdatePasswordSchema),
  Authentication,
  Authorization(["superadmin"]),
  UpdatePassword
);
// ================================ This Api of Admin ============================================
UserRouter.delete(
  "/FreazUser/:id",
  Authentication,
  Authorization(["superadmin"]),
  FreazUser
);

export default UserRouter;
