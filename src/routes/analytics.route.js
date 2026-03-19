const express = require("express");
const { getAnalytics } = require("../controllers/analytics.controllers");
const { identifyUser } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/:urlId", identifyUser, getAnalytics);

module.exports = router;
