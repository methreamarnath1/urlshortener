const urlSchema = require("../models/url.model");
const click = require("../models/click.model");
const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");

const redirectController = async (req, res) => {
  try {
    const { shortcode } = req.params;

    const urlData = await urlSchema.findOneAndUpdate(
      { shortcode },
      { $inc: { clicks: 1 } },
      { new: true },
    );

    if (!urlData) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Track click details
    trackClick(urlData, req);

    return res.redirect(urlData.originalUrl);
  } catch (e) {
    console.error("Error in redirecting", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  redirectController,
};

const trackClick = async (urlData, req) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);

    const ua = new UAParser(req.headers["user-agent"]);

    await click.create({
      urlId: urlData._id,
      timestamp: new Date(),

      ip,

      country: geo?.country || "Unknown",
      city: geo?.city || "Unknown",

      device: ua.getDevice().type || "desktop",
      os: ua.getOS().name,
      browser: ua.getBrowser().name,

      referrer: req.headers.referer || "direct",
    });
  } catch (err) {
    console.error("Click tracking failed", err);
  }
};
