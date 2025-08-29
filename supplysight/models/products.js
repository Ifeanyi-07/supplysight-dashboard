const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true },
  demand: { type: Number, required: true },
  warehouse: { type: String, required: true },
  status: { type: String, enum: ["Healthy", "Low", "Critical"], default: "Healthy" }
});

module.exports = mongoose.model("Product", productSchema);
