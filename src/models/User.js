import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // We'll store hashed passwords
    role: { 
      type: String, 
      enum: ["ADMIN", "MERCHANT", "RIDER"], 
      default: "MERCHANT" 
    },
    phone: { type: String },
    storeName: { type: String }, // For merchants
    status: { 
      type: String, 
      enum: ["ACTIVE", "PENDING", "SUSPENDED"], 
      default: "PENDING" // Need admin approval
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
