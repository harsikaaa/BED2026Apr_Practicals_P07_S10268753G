const Joi = require("joi");

const bookSchema = Joi.object({
  title: Joi.string().min(1).max(50).required(),

  author: Joi.string().min(1).max(50).required(),
});

// Validate book
function validateBook(req, res, next) {

  const { error } = bookSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {

    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");

    return res.status(400).json({
      error: errorMessage,
    });
  }

  next();
}

// Validate ID
function validateBookId(req, res, next) {

  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {

    return res.status(400).json({
      error: "Invalid book ID",
    });
  }

  next();
}

module.exports = {
  validateBook,
  validateBookId,
};