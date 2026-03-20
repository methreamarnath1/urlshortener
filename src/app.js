const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route");
const urlRouter = require("./routes/url.route");
const userRouter = require("./routes/user.route");
const urlRedirect = require("./routes/redirect.route");
const analyticsRouter = require("./routes/analytics.route");
const cors = require("cors");
const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:8080",
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("./public"));
app.get("/", (req, res) => {
  res.send("Welcome to URL Shortener API");
});
/**
 * routers routes;
 */
app.use("/api/auth", authRouter);
app.use("/api/url", urlRouter);
app.use("/api/user", userRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/", urlRedirect);

module.exports = app;
