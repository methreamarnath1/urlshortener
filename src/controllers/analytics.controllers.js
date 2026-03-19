const mongoose = require("mongoose");
const NodeCache = require("node-cache");
const Click = require("../models/click.model");
const Url = require("../models/url.model");

const analyticsCache = new NodeCache({ stdTTL: 300 });

const getAnalytics = async (req, res) => {
  try {
    const { urlId } = req.params;
    const { days = 7 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(urlId)) {
      return res.status(400).json({ message: "Invalid URL ID" });
    }

    const cacheKey = `analytics_${urlId}_${days}`;
    const cached = analyticsCache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    const objectId = new mongoose.Types.ObjectId(urlId);
    console.log("Fetching analytics for URL ID:", urlId);
    console.log("User ID:", req.user._id);
    const url = await Url.findOne({ _id: objectId, userId: req.user.id });
    if (!url) return res.status(404).json({ message: "URL not found" });

    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const [facetResult, clicksPerDay, recentClicks] = await Promise.all([
      Click.aggregate([
        { $match: { urlId: objectId } },
        {
          $facet: {
            totalClicks: [{ $count: "count" }],
            topCountries: [
              { $group: { _id: "$country", count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 10 },
            ],
            deviceBreakdown: [
              { $group: { _id: "$device", count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            browserBreakdown: [
              { $group: { _id: "$browser", count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 5 },
            ],
            osBreakdown: [
              { $group: { _id: "$os", count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            topReferrers: [
              { $group: { _id: "$referrer", count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 5 },
            ],
          },
        },
      ]),

      Click.aggregate([
        { $match: { urlId: objectId, timestamp: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      Click.find({ urlId: objectId })
        .sort({ timestamp: -1 })
        .limit(5)
        .select("timestamp country device browser referrer -_id"),
    ]);

    const f = facetResult[0];

    const result = {
      url: {
        shortUrl: url.shortUrl,
        longUrl: url.longUrl,
        createdAt: url.createdAt,
      },
      totalClicks: f.totalClicks[0]?.count || 0,
      topCountries: f.topCountries,
      deviceBreakdown: f.deviceBreakdown,
      browserBreakdown: f.browserBreakdown,
      osBreakdown: f.osBreakdown,
      topReferrers: f.topReferrers,
      clicksPerDay,
      recentClicks,
      fromCache: false,
    };

    analyticsCache.set(cacheKey, result);
    res.json(result);

  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const invalidateAnalyticsCache = (urlId) => {
  analyticsCache.del(`analytics_${urlId}_7`);
  analyticsCache.del(`analytics_${urlId}_30`);
};

module.exports = { getAnalytics, invalidateAnalyticsCache };