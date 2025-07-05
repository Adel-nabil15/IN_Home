import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "./src/DB/models/user.model.js"; 

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.URI_ONLINE); 
    console.log("✅ Connected to DB");

    const superAdminEmail = "nabiladel052@gmail.com";
    const existingSuperAdmin = await UserModel.findOne({ email: superAdminEmail });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists");
    } else {
      const superAdmin = await UserModel.create({
        name: "Adel Nabil",
        email: superAdminEmail,
        password: "Aa112233", 
        phone: "01272862469",
        address: "Diarb Negm",
      });
      console.log("✅ Super Admin created:", superAdmin.email);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedSuperAdmin();
