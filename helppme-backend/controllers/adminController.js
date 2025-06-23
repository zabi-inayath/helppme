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
    await pool.query(query, [id, name, username, password, profilePic]);
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
  const { approved_by } = req.body;

  if (!approved_by) {
    return res.status(400).json({ success: false, message: "approved_by is required" });
  }

  try {
    const query = "UPDATE services SET status = 'approved', approved_by = ? WHERE id = ?";
    const [result] = await pool.query(query, [approved_by, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, message: "Service approved successfully" });
  } catch (err) {
    handleDatabaseError(err, res);
  }
};

// Reject Service
exports.rejectService = async (req, res) => {
  const { id } = req.params;
  const { rejected_by } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Service ID is required" });
  }
  if (!rejected_by) {
    return res
      .status(400)
      .json({ success: false, message: "Admin Name is required" });
  }

  try {
    const query = "UPDATE services SET status = 'rejected', rejected_by = ? WHERE id = ?";
    await pool.query(query, [rejected_by, id]);
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

// Edit Service
exports.editService = async (req, res) => {
  const { id } = req.params;
  const allowedFields = [
    "name",
    "phone",
    "email",
    "category",
    "service_category",
    "location",
    "image",
    "business_hours",
    "medical_speciality",
    "aadhar_id",
    "service_type",
    "hospital",
    "googleMapLink",
    "message",
    "business_name",
    "status",
    "business_address"
  ];
  // Filter only allowed fields
  const fields = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
  );
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ success: false, message: "No valid fields to update" });
  }

  const setClause = keys.map(key => `${key} = ?`).join(', ');
  try {
    const [result] = await pool.query(
      `UPDATE services SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.json({ success: true });
  } catch (err) {
    handleDatabaseError(err, res);
  }
};


exports.trafficAnalytics = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT SUM(call_count) AS total_call_count FROM services');
    const total = rows[0].total_call_count !== null ? rows[0].total_call_count : 0;
    res.json({ total_call_count: total });
  } catch (err) {
    console.error('Error fetching total call count:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get call count grouped by date (adjust column/table names as needed)
exports.callTraffic = async (req, res) => {
  try {
    const range = parseInt(req.query.range) || 7;
    const [rows] = await pool.query(
      `SELECT DATE(called_at) AS date, COUNT(*) AS call_count
       FROM service_calls
       WHERE called_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(called_at)
       ORDER BY DATE(called_at) ASC`,
      [range]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching call traffic:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};