const express = require("express");
const {
  loginAdmin,
  approveService,
  rejectService,
  signupAdmin,
  deleteService,
  adminDetails
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/login", loginAdmin);
router.post("/signup", signupAdmin);
router.put("/approve/:id", authMiddleware, approveService);
router.put("/reject/:id", authMiddleware, rejectService);
router.delete("/delete/:id", authMiddleware, deleteService);

router.get("/details", adminDetails);


module.exports = router;
