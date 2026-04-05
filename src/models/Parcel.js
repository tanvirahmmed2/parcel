import mongoose from "mongoose";

const ParcelSchema = new mongoose.Schema(
  {
    trackingId: { type: String, unique: true, index: true },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    receiverName: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    address: { type: String, required: true },
    district: { type: String, required: true, index: true },

    codAmount: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    weight: { type: Number, required: true }, // in kg
    deliveryType: { type: String, enum: ["Regular", "Express"], default: "Regular" },
    deliveryOtp: { type: String },
    lastLocation: {
      lat: { type: Number },
      lng: { type: Number }
    },

    status: { 
      type: String, 
      enum: [
        "Pending", 
        "Picked Up", 
        "In Transit", 
        "Hub Received", 
        "Out for Delivery", 
        "Delivered", 
        "Partial Delivered", 
        "Returned"
      ],
      default: "Pending" 
    },

    history: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: String
      }
    ]
  },
  { timestamps: true }
);

export const Parcel = mongoose.models.Parcel || mongoose.model("Parcel", ParcelSchema);
