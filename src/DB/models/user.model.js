import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 11,
      maxlength: 11,
      trim: true,
    },
    role: {
      type: String,
      enum: ["pending","superadmin", "admin"],
      default: "pending",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    joinedAt: {
      type: String, 
      default: () => new Date().toLocaleDateString("en-GB") ,
    },
    isFreezed: {
      type: Boolean,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
