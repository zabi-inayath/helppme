const express = require("express");
const {
  enrollService,
  getApprovedServices,
  pendingApproval,
  getRejectedServices,
  getAllServices
} = require("../controllers/serviceController");

const router = express.Router();
router.post("/enroll", enrollService);

router.get("/enroll/pending", pendingApproval);
router.get("/enroll/approved", getApprovedServices);
router.get("/enroll/rejected", getRejectedServices);

router.get("/enroll/allforms", getAllServices);

module.exports = router;
