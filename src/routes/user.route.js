const express = require("express");
const userRouter = express.Router();
const { identifyUser } = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controllers");
/*
 * @desc: This route is used to get the details of a user created shorturls
 * @route: api/user/urls
 * @method: GET
 */

userRouter.get("/urls/:userId", identifyUser, userController.getUserUrlsController);

module.exports = userRouter;