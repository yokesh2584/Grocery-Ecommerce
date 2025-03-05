import bcrypt from "bcryptjs";

const hashPassword = async () => {
  const password = "admin123"; // Use the actual admin password you want
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);
};

hashPassword();
