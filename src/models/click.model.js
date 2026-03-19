const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },

    ip: String,

    country: String,
    city: String,

    device: String,
    os: String,
    browser: String,

    referrer: String,
  },
  { timestamps: false },
);

// important indexes
clickSchema.index({ urlId: 1, timestamp: -1 });
module.exports = mongoose.model("Click", clickSchema);
