const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  picture: { type: String, required: true },
  phone: { type: String, required: true },
  wishlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Ad", required: false },
  ],
  //   bookingIds: [
  //     { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: false },
  //   ],
  //   token: { type: String, required: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
