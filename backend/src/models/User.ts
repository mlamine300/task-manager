import mongoose from "mongoose";
// const mongoose = require("mongoose");
const RefreshTokenSchema = new mongoose.Schema({
  token: String, // hashed token
  createdAt: { type: Date, default: Date.now },
  ip: String, // optional: track ip/browser for revocation
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    refreshTokens: [RefreshTokenSchema],
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
export default userModel;
