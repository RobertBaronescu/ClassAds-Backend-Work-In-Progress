const mongoose = require("mongoose");

const subcategorySchema = mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Subcategory", subcategorySchema);
