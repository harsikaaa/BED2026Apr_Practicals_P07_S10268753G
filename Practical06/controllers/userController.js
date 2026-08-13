const User = require("../models/userModel");

async function createUser(req, res) {
  try {
    const user = await User.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Controller error in createUser:", error);
    res.status(500).json({ message: "Error creating user" });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Controller error in getAllUsers:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Controller error in getUserById:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
}

async function updateUser(req, res) {
  try {
    const user = await User.updateUser(
      req.params.id,
      req.body
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Controller error in updateUser:", error);
    res.status(500).json({ message: "Error updating user" });
  }
}

async function deleteUser(req, res) {
  try {
    const deleted = await User.deleteUser(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Controller error in deleteUser:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
}

async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm;

  if (!searchTerm) {
    return res.status(400).json({
      message: "Search term is required"
    });
  }

  try {
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error("Controller error in searchUsers:", error);
    res.status(500).json({
      message: "Error searching users"
    });
  }
}

async function getUsersWithBooks(req, res) {
  try {
    const users = await User.getUsersWithBooks();
    res.json(users);
  } catch (error) {
    console.error(
      "Controller error in getUsersWithBooks:",
      error
    );
    res.status(500).json({
      message: "Error fetching users with books"
    });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  getUsersWithBooks
};