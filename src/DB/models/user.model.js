import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
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
      enum: ["superadmin", "admin"],
      default: "admin",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    joinedAt: {
      type: Date, 
      default: () => new Date().toLocaleDateString("en-GB"), 
    },
    isFreezed: {
      type: Boolean,
    },
    confirmed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
