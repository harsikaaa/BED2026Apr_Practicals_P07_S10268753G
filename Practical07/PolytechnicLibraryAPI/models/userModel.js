const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getUserByUsername(username) {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const request = connection.request();
    request.input("username", sql.VarChar(255), username);

    const result = await request.query(`
      SELECT user_id, username, passwordHash, role
      FROM Users
      WHERE username = @username
    `);

    return result.recordset.length ? result.recordset[0] : null;
  } finally {
    if (connection) await connection.close();
  }
}

async function createUser(username, passwordHash, role) {
  let connection;

  try {
    connection = await sql.connect(dbConfig);

    const request = connection.request();
    request.input("username", sql.VarChar(255), username);
    request.input("passwordHash", sql.VarChar(255), passwordHash);
    request.input("role", sql.VarChar(20), role);

    const result = await request.query(`
      INSERT INTO Users (username, passwordHash, role)
      VALUES (@username, @passwordHash, @role);

      SELECT user_id, username, role
      FROM Users
      WHERE user_id = SCOPE_IDENTITY();
    `);

    return result.recordset[0];
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  getUserByUsername,
  createUser
};