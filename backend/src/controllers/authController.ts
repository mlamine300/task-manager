import express from "express";
import type { NextFunction, Response, Request } from "express";
import userModel from "../models/User.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
      const token = await jwt.sign(
        { userId: user._id, role: user.role },
        process.env.TOKEN_SECRET || "",
        { expiresIn: "7d" }
      );
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
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(404).json({ message: "email and password are required" });
  const user = await userModel.findOne({ email }).lean().exec();

  if (!user || !user.password)
    return res.status(409).json({ message: "incorrect email or password" });
  const compare = await bcrypt.compare(password, user.password);
  if (!compare)
    return res.status(409).json({ message: "incorrect email or password" });
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.TOKEN_SECRET || "",
    { expiresIn: "7d" }
  );
  res.status(200).json(token);
  return token;
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
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
