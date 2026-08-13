const Joi = require("joi");

// Validation schema
const studentSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),

  email: Joi.string().email().required(),
});

// Validate student
function validateStudent(req, res, next) {

  const { error } = studentSchema.validate(
    req.body,
    {
      abortEarly: false,
    }
  );

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
function validateStudentId(req, res, next) {

  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {

    return res.status(400).json({
      error:
        "Invalid student ID. ID must be a positive number",
    });
  }

  next();
}

module.exports = {
  validateStudent,
  validateStudentId,
};