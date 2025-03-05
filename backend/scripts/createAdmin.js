import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      mongoose.connection.close();
      return;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash("admin@123", 10);

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admingrocery@example.com",
      password: hashedPassword,
      isAdmin: true,
      address: "",
      city: "",
      postalCode: "",
      country: "",
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating admin user:", error);
    mongoose.connection.close();
  }
};

createAdmin();
