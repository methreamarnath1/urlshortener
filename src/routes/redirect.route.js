const express = require("express");

const urlRedirect = express.Router();
const {
  redirectController,
} = require("../controllers/urlRenderer.controllers");

/*
 * @desc: This route is used to redirect to the original URL
 * @route: /api/url/:shortUrl
 * @method: GET
 * router.get("/:shortUrl", redirectController);
 */

urlRedirect.get("/:shortUrl", redirectController);

module.exports = urlRedirect;
