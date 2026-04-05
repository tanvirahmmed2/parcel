import mongoose from "mongoose";

const WithdrawalSchema = new mongoose.Schema(
  {
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["PENDING", "APPROVED", "PAID"], 
      default: "PENDING" 
    },
    transactionId: { type: String },
    approvedAt: { type: Date },
    paidAt: { type: Date }
  },
  { timestamps: true }
);

export const Withdrawal = mongoose.models.Withdrawal || mongoose.model("Withdrawal", WithdrawalSchema);
