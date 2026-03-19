const urlSchema = require("../models/url.model");
const { nanoid } = require("nanoid");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Simple URL validator (no external deps)
const isValidUrl = (str) => {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const createShortUrlController = async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ message: "longUrl is required" });
    }

    // 1. Validate the URL format
    if (!isValidUrl(longUrl)) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // 2. Return existing short URL if user already shortened this URL
    const existing = await urlSchema.findOne({
      userId: req.user.id,
      originalUrl: longUrl,
    });

    if (existing) {
      return res.status(200).json({
        message: "Short URL already exists",
        data: formatResponse(existing),
      });
    }

    const shortUrl = nanoid(8);
    const newUrl = await urlSchema.create({
      userId: req.user.id,
      originalUrl: longUrl,
      shortUrl,
    });

    res.status(201).json({
      message: "Short URL created successfully",
      data: formatResponse(newUrl),
    });
  } catch (e) {
    console.error("Error in creating short URL", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

const redirectController = async (req, res) => {
  try {
    const { shortUrl } = req.params;

    // 3. Atomic increment to avoid race conditions
    const urlData = await urlSchema.findOneAndUpdate(
      { shortUrl },
      { $inc: { clicks: 1 } },
      { new: true },
    );

    if (!urlData) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    res.redirect(urlData.originalUrl);
  } catch (e) {
    console.error("Error in redirecting to original URL", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete the url
const deleteShortUrlController = async (req, res) => {
  try {
    const { id } = req.params;
    const url = await urlSchema.findById(id);
    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }
    if (req.user.id !== url.userId.toString()) {
      console.log("User ID mismatch:", req.user.id, url.userId);
      return res.status(403).json({ message: "Unauthorized" });
    }
    await urlSchema.findByIdAndDelete(id);
    res.status(200).json({
      message: "Short URL deleted successfully",
      data: formatResponse(url),
    });
  } catch (e) {
    console.error("Error in deleting short URL", e);
    res.status(500).json({ message: "Internal server error" });
  }
};





// 4. Reusable response formatter with env-based base URL
const formatResponse = (urlDoc) => ({
  id: urlDoc._id,
  originalUrl: urlDoc.originalUrl,
  shortUrl: `${BASE_URL}/api/url/${urlDoc.shortUrl}`,
  clicks: urlDoc.clicks,
  createdAt: urlDoc.createdAt,
});

module.exports = {
  createShortUrlController,
  redirectController,
  deleteShortUrlController,
};
