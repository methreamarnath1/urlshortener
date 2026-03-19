const express = require("express");
const urlRouter = express.Router();

const urlController = require("../controllers/url.controllers");
const { identifyUser } = require("../middlewares/auth.middleware");

/*
    * @desc: This route is used to create a short URL
    * @route: /api/url/
    * @method: POST
    * test data: {
        "longUrl": "https://www.google.com"
    }   

*/
urlRouter.post("/", identifyUser, urlController.createShortUrlController);

/*
 * @desc: This route is used to redirect to the original URL
 * @route: /api/url/:shortUrl
 * @method: GET
 * router.get("/:shortUrl", redirectController);
 */

urlRouter.get("/:shortUrl", urlController.redirectController);

module.exports = urlRouter;
