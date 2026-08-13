const Book = require("../models/bookModel");

async function getAllBooks(req, res) {
  try {
    const books = await Book.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching books"
    });
  }
}

async function updateBookAvailability(req, res) {
  const { bookId } = req.params;
  const { availability } = req.body;

  if (!["Y", "N"].includes(availability)) {
    return res.status(400).json({
      message: "Availability must be Y or N"
    });
  }

  try {
    const book = await Book.updateBookAvailability(
      bookId,
      availability
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json({
      message: "Book availability updated successfully",
      book
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating book availability"
    });
  }
}

module.exports = {
  getAllBooks,
  updateBookAvailability
};