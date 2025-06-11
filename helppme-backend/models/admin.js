const pool1 = require("../config/db"); // Import the pool

const createAdminTable = `
  CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profilePic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

// Use async/await to create the table
const initializeTable = async () => {
  try {
    await pool1.query(createAdminTable);
    console.log("Admin table is ready.");
  } catch (err) {
    console.error("Error creating 'admins' table:", err.message);
  }
};

// Call the function to initialize the table
initializeTable();

module.exports = pool1; // Export the pool
