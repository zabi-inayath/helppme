const pool = require("../config/db"); // Import the pool

const createServiceTable = `
  CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(70) NOT NULL UNIQUE,
    category ENUM('emergency', 'medical', 'utilities', 'travel', 'public', 'vehicle') NOT NULL,
    service_category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image VARCHAR(100) DEFAULT 'https://res.cloudinary.com/dhcfcubwa/image/upload/v1740481737/nooho00u6zzhbhqtzbxv.png',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    business_hours VARCHAR(100) NOT NULL,
    business_name VARCHAR(200),
    business_address VARCHAR(255),
    aadhar_id CHAR(12),
    medical_speciality VARCHAR(100),
    service_type VARCHAR(200),
    hospital VARCHAR(200),
    googleMapLink VARCHAR(255),
    message VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

// Use async/await to create the table
const initializeTable = async () => {
  try {
    await pool.query(createServiceTable);
    console.log("Service table is ready.");
  } catch (err) {
    console.error("Error creating 'services' table:", err.message);
  }
};

// Call the function to initialize the table
initializeTable();

module.exports = pool; // Export the pool
