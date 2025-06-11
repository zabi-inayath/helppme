const db = require("../config/db");

exports.submitForm = (req, res) => {
  const {
    name,
    phone_number,
    email,
    city,
    device,
    heard_from,
    agreed_to_terms
  } = req.body;

  const sql = `
    INSERT INTO downloads (name, phone_number, email, city, device, heard_from, agreed_to_terms)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, phone_number, email, city, device, heard_from, agreed_to_terms],
    (err, result) => {
      if (err) {
        console.error("Form submission error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }

      res
        .status(200)
        .json({ success: true, message: "Form submitted successfully" });
    }
  );
};
