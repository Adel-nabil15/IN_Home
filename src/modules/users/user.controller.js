import Router from "express";
const UserRouter = Router();
import {
  SignUp,
  login,
  GetProfile,
  UpdateProfile,
  UpdatePassword,
  FreazUser,
} from "./user.service.js";
import { Authentication, Authorization } from "../../middleware/Auth.js";

UserRouter.post("/SignUp", SignUp);
UserRouter.post("/login", login);
UserRouter.post("/GetProfile", Authentication, GetProfile);
UserRouter.patch("/UpdateProfile", Authentication, UpdateProfile);
UserRouter.patch("/UpdatePassword", Authentication, UpdatePassword);
UserRouter.delete("/FreazUser/:id", Authentication,Authorization(["superadmin"]), FreazUser);

export default UserRouter;
