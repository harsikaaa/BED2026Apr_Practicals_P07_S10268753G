const express = require("express");
const dotenv = require("dotenv");

const userController = require("./controllers/userController");
const bookController = require("./controllers/bookController");
const {
  verifyJWT,
  requireRole
} = require("./middleware/authMiddleware");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", userController.registerUser);

app.post("/login", userController.login);

app.get(
  "/books",
  verifyJWT,
  requireRole("member", "librarian"),
  bookController.getAllBooks
);

app.put(
  "/books/:bookId/availability",
  verifyJWT,
  requireRole("librarian"),
  bookController.updateBookAvailability
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});