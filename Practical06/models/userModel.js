const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function createUser(user) {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const query = `
      INSERT INTO Users (username, email)
      VALUES (@username, @email);
      SELECT SCOPE_IDENTITY() AS id;
    `;

    const request = connection.request();
    request.input("username", user.username);
    request.input("email", user.email);

    const result = await request.query(query);

    return await getUserById(result.recordset[0].id);
  } finally {
    if (connection) await connection.close();
  }
}

async function getAllUsers() {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const result = await connection.request().query(
      "SELECT id, username, email FROM Users"
    );

    return result.recordset;
  } finally {
    if (connection) await connection.close();
  }
}

async function getUserById(id) {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const request = connection.request();
    request.input("id", id);

    const result = await request.query(
      "SELECT id, username, email FROM Users WHERE id = @id"
    );

    return result.recordset.length ? result.recordset[0] : null;
  } finally {
    if (connection) await connection.close();
  }
}

async function updateUser(id, updatedUser) {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const request = connection.request();
    request.input("id", id);
    request.input("username", updatedUser.username);
    request.input("email", updatedUser.email);

    const result = await request.query(`
      UPDATE Users
      SET username = @username,
          email = @email
      WHERE id = @id
    `);

    if (result.rowsAffected[0] === 0) {
      return null;
    }

    return await getUserById(id);
  } finally {
    if (connection) await connection.close();
  }
}

async function deleteUser(id) {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const request = connection.request();
    request.input("id", id);

    const result = await request.query(
      "DELETE FROM Users WHERE id = @id"
    );

    return result.rowsAffected[0] > 0;
  } finally {
    if (connection) await connection.close();
  }
}

async function searchUsers(searchTerm) {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const request = connection.request();
    request.input("searchTerm", sql.NVarChar, searchTerm);

    const result = await request.query(`
      SELECT id, username, email
      FROM Users
      WHERE username LIKE '%' + @searchTerm + '%'
         OR email LIKE '%' + @searchTerm + '%'
    `);

    return result.recordset;
  } finally {
    if (connection) await connection.close();
  }
}

async function getUsersWithBooks() {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const result = await connection.request().query(`
      SELECT
        u.id AS user_id,
        u.username,
        u.email,
        b.id AS book_id,
        b.title,
        b.author
      FROM Users u
      LEFT JOIN UserBooks ub ON ub.user_id = u.id
      LEFT JOIN Books b ON ub.book_id = b.id
      ORDER BY u.username
    `);

    const usersWithBooks = {};

    for (const row of result.recordset) {
      if (!usersWithBooks[row.user_id]) {
        usersWithBooks[row.user_id] = {
          id: row.user_id,
          username: row.username,
          email: row.email,
          books: []
        };
      }

      if (row.book_id !== null) {
        usersWithBooks[row.user_id].books.push({
          id: row.book_id,
          title: row.title,
          author: row.author
        });
      }
    }

    return Object.values(usersWithBooks);
  } finally {
    if (connection) await connection.close();
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