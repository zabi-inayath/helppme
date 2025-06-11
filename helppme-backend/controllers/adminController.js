const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// Helper function to handle database errors
const handleDatabaseError = (err, res) => {
  console.error("Database error:", err.message);
  return res
    .status(500)
    .json({ success: false, message: "Database error", error: err.message });
};

// Helper function to validate required fields
const validateRequiredFields = (fields, res) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return res
        .status(400)
        .json({ success: false, message: `${key} is required` });
    }
  }
  return null;
};

// Signup Admin
exports.signupAdmin = async (req, res) => {
  const { id, name, username, password, profilePic } = req.body;

  // Validate required fields
  const validationError = validateRequiredFields(
    { id, name, username, password },
    res
  );
  if (validationError) return validationError;

  try {
    const query =
      "INSERT INTO admins (id, name, username, password, profilePic) VALUES (?, ?, ?, ?, ?)";
    await pool.query(query, [id,name, username, password, profilePic]);
    res.status(201).json({ success: true, message: "Signup Successful!" });
  } catch (err) {
    handleDatabaseError(err, res);
  }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Validate required fields
  const validationError = validateRequiredFields({ username, password }, res);
  if (validationError) return validationError;

  try {
    const query = "SELECT * FROM admins WHERE username = ? AND password = ?";
    const [results] = await pool.query(query, [username, password]);

    if (results.length === 0) {
      console.log("Unauthorized Admin login detected");
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: results[0].id, username: results[0].username },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m"
      }
    );
    console.log(`Admin: ${username} logged in`);
    res.status(200).json({ success: true, token, username });
  } catch (err) {
    handleDatabaseError(err, res);
  }
};

exports.adminDetails = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    console.log(decoded);

    const username = decoded.id; // Extract username from token

    console.log("Decoded ID:", username);

    // Query to fetch admin details
    const query = "SELECT * FROM admins WHERE id = ?";
    const [results] = await pool.query(query, [username]);

    if (results.length > 0) {
      const admin = results[0]; // Extract the first admin record
      console.log(`Admin: ${username} fetched details`);
      return res.status(200).json({
        admin // Send back admin details
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
  } catch (err) {
    console.error("Error in adminDetails API:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Approve Service
exports.approveService = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Service ID is required" });
  }

  try {
    const query = "UPDATE services SET status = 'approved' WHERE id = ?";
    await pool.query(query, [id]);
    res.status(200).json({ success: true, message: "Service approved." });
  } catch (err) {
    handleDatabaseError(err, res);
  }
};

// Reject Service
exports.rejectService = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Service ID is required" });
  }

  try {
    const query = "UPDATE services SET status = 'rejected' WHERE id = ?";
    await pool.query(query, [id]);
    res.status(200).json({ success: true, message: "Service rejected." });
  } catch (err) {
    handleDatabaseError(err, res);
  }
};

// Delete Service
exports.deleteService = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Service ID is required" });
  }

  try {
    const query = "DELETE FROM services WHERE id = ?";
    await pool.query(query, [id]);
    res.status(200).json({ success: true, message: "Service deleted." });
  } catch (err) {
    handleDatabaseError(err, res);
  }
};
