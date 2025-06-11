const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Extract token from the 'Authorization' header
  const token = req.header("Authorization")?.split(" ")[1]; // Format: 'Bearer <token>'

  // Check if token exists
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified; // Attach the decoded token payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("JWT verification error:", err.message);

    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Token expired. Please log in again."
        });
    } else if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid token. Please log in again."
        });
    } else {
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error during token verification."
        });
    }
  }
};
