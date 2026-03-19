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
 * @desc: This route isto delete a short URL
 * @route: /api/url/:id
 * @method: DELETE
 * test data: {
    "id": "64a9b8c5e4b0f1a2b3c4d5e"
}   
 * 
 */
urlRouter.delete("/:id", identifyUser, urlController.deleteShortUrlController);


/*
    * @desc: This route is to get the analitical data of a short URL
    * @route: /api/url/analytics/:id
    * @method: GET
    * test data: {
        "id": "64a9b8c5e4b0f1a2b3c4d5e"
    }
        */
// urlRouter.get("/analytics/:id", identifyUser, urlController.getUrlAnalyticsController);



module.exports = urlRouter;
