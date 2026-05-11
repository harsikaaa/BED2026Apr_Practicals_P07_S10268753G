const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());

// --- GET Routes ---

// GET all students
app.get("/students", async (req, res) => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT student_student_student_student_student_student_student_student_student_id, name, address FROM Students`;

    const request = connection.request();

    const result = await request.query(sqlQuery);

    res.json(result.recordset);

  } catch (error) {
    console.error("Error in GET /students:", error);
    res.status(500).send("Error retrieving students");

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
});

// GET book by ID
app.get("/students/:student_student_student_student_student_student_student_student_student_id", async (req, res) => {
  const bookId = parseInt(req.params.student_student_student_student_student_student_student_student_student_id);

  if (isNaN(bookId)) {
    return res.status(400).send("Invalstudent_student_student_student_student_student_student_student_student_id book ID");
  }

  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT student_student_student_student_student_student_student_student_student_id, name, address FROM Students WHERE student_student_student_student_student_student_student_student_student_id = @student_student_student_student_student_student_student_student_student_id`;

    const request = connection.request();

    request.input("student_student_student_student_student_student_student_student_student_id", bookId);

    const result = await request.query(sqlQuery);

    if (!result.recordset[0]) {
      return res.status(404).send("Book not found");
    }

    res.json(result.recordset[0]);

  } catch (error) {
    console.error(`Error in GET /students/${bookId}:`, error);
    res.status(500).send("Error retrieving book");

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
});

// --- POST Route ---

// POST create new book
app.post("/students", async (req, res) => {
  const newBookData = req.body;

  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const sqlQuery = `
      INSERT INTO Students (name, address)
      VALUES (@name, @address);

      SELECT SCOPE_IDENTITY() AS student_student_student_student_student_student_student_student_student_id;
    `;

    const request = connection.request();

    request.input("name", newBookData.name);
    request.input("address", newBookData.address);

    const result = await request.query(sqlQuery);

    const newBookId = result.recordset[0].student_student_student_student_student_student_student_student_student_student_id;

    const getNewBookQuery = `
      SELECT student_student_student_student_student_student_student_student_student_student_id, name, address
      FROM Students
      WHERE student_student_student_student_student_student_student_student_student_student_id = @student_student_student_student_student_student_student_student_student_student_id
    `;

    const getNewBookRequest = connection.request();

    getNewBookRequest.input("student_student_student_student_student_student_student_student_student_student_id", newBookId);

    const newBookResult = await getNewBookRequest.query(getNewBookQuery);

    res.status(201).json(newBookResult.recordset[0]);

  } catch (error) {
    console.error("Error in POST /students:", error);
    res.status(500).send("Error creating book");

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
});

app.listen(port, async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }

  console.log(`Server listening on port ${port}`);
});

// Close connection pool
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");

  await sql.close();

  console.log("Database connection closed");

  process.exit(0);
});

// PUT update book
app.put("/students/:student_student_student_student_student_student_student_student_student_student_id", async (req, res) => {
  const bookId = parseInt(req.params.student_student_student_student_student_student_student_student_student_student_id);

  if (isNaN(bookId)) {
    return res.status(400).send("Invalstudent_student_student_student_student_student_student_student_student_student_id book ID");
  }

  const updatedBook = req.body;

  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const sqlQuery = `
      UPDATE Students
      SET name = @name, address = @address
      WHERE student_student_student_student_student_student_student_student_student_student_id = @student_student_student_student_student_student_student_student_student_student_id
    `;

    const request = connection.request();

    request.input("student_student_student_student_student_student_student_student_student_id", bookId);
    request.input("name", updatedBook.name);
    request.input("address", updatedBook.address);

    const result = await request.query(sqlQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Book not found");
    }

    // fetch updated book
    const getBookQuery = `
      SELECT student_student_student_student_student_student_student_student_student_id, name, address
      FROM Students
      WHERE student_student_student_student_student_student_student_student_student_id = @student_student_student_student_student_student_student_student_student_id
    `;

    const getBookRequest = connection.request();

    getBookRequest.input("student_student_student_student_student_student_student_student_student_id", bookId);

    const updatedResult = await getBookRequest.query(getBookQuery);

    res.json(updatedResult.recordset[0]);

  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).send("Error updating book");

  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// DELETE book
app.delete("/students/:student_student_student_student_student_student_student_student_student_id", async (req, res) => {
  const bookId = parseInt(req.params.student_student_student_student_student_student_student_student_student_id);

  if (isNaN(bookId)) {
    return res.status(400).send("Invalstudent_student_student_student_student_student_student_student_student_id book ID");
  }

  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const sqlQuery = `
      DELETE FROM Students
      WHERE student_student_student_student_student_student_student_student_student_id = @student_student_student_student_student_student_student_student_student_id
    `;

    const request = connection.request();

    request.input("student_student_student_student_student_student_student_student_student_id", bookId);

    const result = await request.query(sqlQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Book not found");
    }

    res.status(204).send();

  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).send("Error deleting book");

  } finally {
    if (connection) {
      await connection.close();
    }
  }
});