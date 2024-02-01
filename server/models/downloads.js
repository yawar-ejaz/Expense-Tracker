const mongoose = require("mongoose");

const DownloadSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Downloads = mongoose.model("Downloads", DownloadSchema);

module.exports = Downloads;
