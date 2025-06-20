const pool = require("../config/db");

// Helper function to handle database errors
const handleDatabaseError = (err, res) => {
  console.error("Database error:", err.message);
  return res
    .status(500)
    .json({
      success: false,
      message: `Database error ${err.message}`,
      error: err.message
    });
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

// Enroll Service
exports.enrollService = async (req, res) => {
  const {
    name,
    phone,
    email,
    category,
    service_category,
    location,
    image,
    business_hours,
    medical_speciality,
    aadhar_id,
    service_type,
    hospitalName,
    googleMapLink,
    message
  } = req.body;

  // Validate required fields
  const validationError = validateRequiredFields(
    {
      name,
      phone,
      email,
      category,
      service_category,
      location,
      business_hours
    },
    res
  );
  if (validationError) return validationError;

  // Set default image value if not provided
  const defaultImage =
    "https://res.cloudinary.com/dhcfcubwa/image/upload/v1740481737/nooho00u6zzhbhqtzbxv.png";
  const finalImage = image || defaultImage;

  try {
    const query =
      "INSERT INTO services (name, phone, email, category, service_category, location, image, business_hours, medical_speciality, aadhar_id, service_type, hospitalName, googleMapLink, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await pool.query(query, [
      name,
      phone,
      email,
      category,
      service_category,
      location,
      finalImage,
      business_hours,
      medical_speciality,
      aadhar_id,
      service_type,
      hospitalName,
      googleMapLink,
      message
    ]);
    res.status(201).json({
      success: true,
      message: "Service enrollment request submitted."
    });
  } catch (err) {
    // Duplicate entry error handling
    if (err.code === "ER_DUP_ENTRY") {
      let field = "data";
      if (err.message.includes("email")) field = "email";
      else if (err.message.includes("phone")) field = "mobile";
      // Add more fields if needed

      return res.status(400).json({
        success: false,
        message: `${field} already registered`
      });
    }
    handleDatabaseError(err, res);
  }
};

// Get Pending Services
exports.pendingApproval = async (req, res) => {
  try {
    const query = "SELECT * FROM services WHERE status = 'pending'";
    const [results] = await pool.query(query);
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    handleDatabaseError(err, res);
  }
};

// Get Approved Services
exports.getApprovedServices = async (req, res) => {
  try {
    const query = "SELECT * FROM services WHERE status = 'approved'";
    const [results] = await pool.query(query);
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    handleDatabaseError(err, res);
  }
};

// Get Rejected Services
exports.getRejectedServices = async (req, res) => {
  try {
    const query = "SELECT * FROM services WHERE status = 'rejected'";
    const [results] = await pool.query(query);
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    handleDatabaseError(err, res);
  }
};

// Get All Services
exports.getAllServices = async (req, res) => {
  try {
    const query = "SELECT * FROM services";
    const [results] = await pool.query(query);
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    handleDatabaseError(err, res);
  }
};

// // Approve Service
// exports.approveService = async (req, res) => {
//   const { id } = req.params;
//   const { approved_by } = req.body;

//   if (!approved_by) {
//     return res.status(400).json({ success: false, message: "approved_by is required" });
//   }

//   try {
//     const query = "UPDATE services SET status = 'approved', approved_by = ? WHERE id = ?";
//     const [result] = await pool.query(query, [approved_by, id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: "Service not found" });
//     }

//     res.status(200).json({ success: true, message: "Service approved successfully" });
//   } catch (err) {
//     handleDatabaseError(err, res);
//   }
// };
