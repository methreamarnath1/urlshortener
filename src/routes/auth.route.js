const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controllers");
const { identifyUser } = require("../middlewares/auth.middleware");

/*
* @desc: This route is used for user registration
* @route: /api/auth/register
* @method: POST
* test user: {
    "username": "amar",
    "email": "amar@gmail.com",
    "password": "amar123"
}
*/

authRouter.post("/register", authController.registerContoller);

/*
 * @desc: This route is used for user login
 * @route: /api/auth/login
 * @method: POST
 * * test user: {
    "username": "amar",
    "email": "amar@gmail.com",
    "password": "amar123"
}
 */

authRouter.post("/login", authController.loginController);
/*
 * @desc: This route is used to get the details of the logged in user
 * @route: /api/auth/getme
 * @method: GET
 */
authRouter.get("/getme", identifyUser, authController.getMeController);
module.exports = authRouter;
