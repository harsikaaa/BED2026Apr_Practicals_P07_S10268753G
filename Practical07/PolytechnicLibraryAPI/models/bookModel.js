const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getAllBooks() {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const result = await connection.request().query(`
      SELECT book_id, title, author, availability
      FROM Books
    `);

    return result.recordset;
  } finally {
    if (connection) await connection.close();
  }
}

async function updateBookAvailability(bookId, availability) {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const request = connection.request();

    request.input("book_id", sql.Int, bookId);
    request.input("availability", sql.Char(1), availability);

    const result = await request.query(`
      UPDATE Books
      SET availability = @availability
      WHERE book_id = @book_id
    `);

    if (result.rowsAffected[0] === 0) {
      return null;
    }

    const updated = await connection.request()
      .input("book_id", sql.Int, bookId)
      .query(`
        SELECT book_id, title, author, availability
        FROM Books
        WHERE book_id = @book_id
      `);

    return updated.recordset[0];
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  getAllBooks,
  updateBookAvailability
};