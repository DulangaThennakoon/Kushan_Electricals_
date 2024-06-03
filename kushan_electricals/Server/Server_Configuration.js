const mysql = require("mysql");

const db = mysql.createPool({
  connectionLimit: 100, // Set the connection limit based on your application's needs
  host: "localhost",
  port: 3306, // Specify the port separately
  user: "root",
  password: "",
  database: "kushan_electricals",
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the process with a failure code
  } else {
    console.log('Connected to the database');
    // Release the connection back to the pool
    connection.release();
  }
});

module.exports = db;
