import express from "express";
import type { NextFunction, Response, Request } from "express";
import userModel from "../models/User.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/index.ts";
import { signAccessToken, signRefreshToken } from "../utils/token.ts";
import { User } from "../../../types/index.ts";
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, profileImageUrl, role } = req.body;
  if (!name || !email || !password)
    return res.status(404).json({ message: "feild are required!" });
  const existUserEmail = await userModel.findOne({ email }).lean().exec();
  const existUserName = await userModel.findOne({ name }).lean().exec();
  if (existUserEmail)
    return res.status(409).json({ message: "this email already taken" });
  if (existUserName)
    return res.status(409).json({ message: "this name already taken" });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.insertOne({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
    });
    if (user) {
      const token = signAccessToken(user);
      // await jwt.sign(
      //   { userId: user._id, role: user.role },
      //   process.env.ACCESS_TOKEN_SECRET || "",
      //   { expiresIn: "7d" }
      // );
      return res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        token,
      });
    }
  } catch (error) {
    console.log("error regestring a user", error);
  }
  return res.status(500).json({ message: "server error" });
};

export const loginUser = async (req: Request, res: Response) => {
  console.log("-------------------");
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(404).json({ message: "email and password are required" });
  const foundUser = await userModel.findOne({ email }).select("").exec();

  if (!foundUser || !foundUser.password)
    return res.status(409).json({ message: "incorrect email or password" });
  const compare = await bcrypt.compare(password, foundUser.password);
  if (!compare)
    return res.status(409).json({ message: "incorrect email or password" });

  const accessToken = signAccessToken(foundUser);
  const refreshToken = signRefreshToken(foundUser);

  const hashed = bcrypt.hash(refreshToken, 10);
  foundUser.refreshTokens.push({ token: hashed });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
    sameSite: "none", // if frontend is on a different domain; else consider 'Strict' or 'Lax'
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000, // match REFRESH_TOKEN_EXPIRES_IN
  });

  const user = {
    token: accessToken,
    profileImageUrl: foundUser.profileImageUrl,
    email: foundUser.email,
    name: foundUser.name,
    role: foundUser.role,
  };
  return res.status(200).json(user);
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json("un authorized");
    const { userId } = (await jwt.decode(token)) as TokenPayload;
    if (!userId) {
      return res.status(409).json({ message: "user id is required!!" });
    }
    const user = await userModel
      .findById(userId)
      .select("-password")
      .lean()
      .exec();
    if (!user)
      return res.status(404).json({ message: "there is no user with such id" });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error, ", error });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, name, email, password, profileImageUrl, role } = req.body;
    if (!userId)
      return res.status(404).json({ message: "user id is required!" });
    const user = await userModel
      .findById(userId)
      .select("-password")
      .lean()
      .exec();
    if (!user)
      return res
        .status(404)
        .json({ message: "there is no such user with this id" });
    let newName = user.name,
      newEmail = user.email,
      newProfileImageUrl = user.profileImageUrl,
      newRole = user.role,
      newPassword = null;
    if (name) {
      const foundUser = await userModel.findOne({ name }).lean().exec();
      if (foundUser)
        return res
          .status(409)
          .json({ message: "this name is already taken!!!" });
      newName = name;
    }
    if (email) {
      const foundUser = await userModel.findOne({ email }).lean().exec();
      if (foundUser)
        return res
          .status(409)
          .json({ message: "this email is already taken!!!" });
      newEmail = email;
    }
    if (profileImageUrl) newProfileImageUrl = profileImageUrl;
    if (role) newRole = role;
    if (password) {
      const hashPass = await bcrypt.hash(password, 10);
      newPassword = hashPass;
    }
    const newUser = await userModel.findByIdAndUpdate(userId, {
      name: newName,
      email: newEmail,
      profileImageUrl: newProfileImageUrl,
      role: newRole,
      password: newPassword,
    });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "server error, ", error });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  console.log(req.cookies);
  if (!req.cookies)
    return res.status(401).json({ messsage: "there is no refresh token" });
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ messsage: "there is no refresh token" });
  const payload = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET || ""
  ) as TokenPayload;
  const user = await userModel.findById(payload.userId);
  if (!user) return res.status(401).json({ message: "invalid refresh token" });

  const idx = user.refreshTokens.findIndex((rt) => rt.token === token);
  if (idx === -1) {
    user.refreshTokens.splice(0, user.refreshTokens.length);
    await user.save();
    return res.status(403).json({ msg: "Reuse detected" });
  }
  user.refreshTokens.splice(idx, 1);
  const newRefreshToken = signRefreshToken(user);
  const hashed = bcrypt.hash(newRefreshToken, 10);
  user.refreshTokens.push(hashed);
  await user.save();
  const accessToken = signAccessToken(user);

  // Set new refresh cookie (replace previous)
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};
export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const hashed = await bcrypt.hash(token, 10);
    // Remove this hashed token from all users (or current user)
    await userModel.updateOne(
      { "refreshTokens.token": hashed },
      { $pull: { refreshTokens: { token: hashed } } }
    );
  }
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
  res.sendStatus(204);
};
