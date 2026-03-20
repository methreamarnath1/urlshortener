const urlSchema = require("../models/url.model");
const userModel = require("../models/user.model");

const getUserUrlsController = async (req, res) => {
  const userId = req.params.userId;
  const userUrls = await urlSchema.find({ userId });
  try {
    if (userUrls.length === 0) {
      return res.status(404).json({ message: "No URLs found for this user" });
    }
    res.status(200).json({
      message: "User URLs retrieved successfully",
      data: userUrls.map((url) => ({
        id: url._id,
        originalUrl: url.originalUrl,
        shortUrl: `https://urlshortener-1-11bw.onrender.com/${url.shortUrl}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
      })),
    });
  } catch (e) {
    console.error("Error in fetching user URLs", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserUrlsController,
};
