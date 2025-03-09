const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    priceUSD: { type: Number, required: true, min: 0.01 },
    priceIDR: { type: Number, required: true, min: 0 },
    media: [
      {
        data: String, // Base64 string
        contentType: String, // MIME type (image/png, video/mp4, etc.)
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
