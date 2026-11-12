import dotenv from "dotenv";
import mongoose from "mongoose";
import UserModel from "./Model/UserModel.js";

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.log("\n❌ Please provide an email address!");
  console.log("👉 Example: node make-admin.js test@example.com\n");
  process.exit(1);
}

const uri = process.env.RK_URI || process.env.DB_URI;

console.log(`Connecting to database to make '${email}' an ADMIN...`);

mongoose
  .connect(uri)
  .then(async () => {
    const user = await UserModel.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { role: "ADMIN" },
      { new: true }
    );

    if (!user) {
      console.log(`\n❌ User with email "${email}" nahi mila! Pehle register karein.`);
    } else {
      console.log("\n🎉 Mubarak ho! User ab ADMIN ban gaya hai:");
      console.log(`👤 Name: ${user.name}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🛡️ Role: ${user.role}`);
      console.log("\nAb frontend par logout karke fir se login karein!");
    }
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  });

