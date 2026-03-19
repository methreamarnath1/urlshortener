const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route");
const urlRouter = require("./routes/url.route");
const userRouter = require("./routes/user.route");
const urlRedirect = require("./routes/redirect.route");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to URL Shortener API");
});
/**
 * routers routes;
 */
app.use("/api/auth", authRouter);
app.use("/api/url", urlRouter);
app.use("/api/user", userRouter);
app.use("/", urlRedirect);

module.exports = app;
