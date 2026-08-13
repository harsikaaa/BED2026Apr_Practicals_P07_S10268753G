const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function registerUser(req, res) {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({
      message: "Username, password and role are required"
    });
  }

  if (!["member", "librarian"].includes(role)) {
    return res.status(400).json({
      message: "Role must be member or librarian"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters"
    });
  }

  try {
    const existingUser = await User.getUserByUsername(username);

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.createUser(
      username,
      passwordHash,
      role
    );

    res.status(201).json({
      message: "User created successfully",
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  try {
    const user = await User.getUserByUsername(username);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

module.exports = {
  registerUser,
  login
};