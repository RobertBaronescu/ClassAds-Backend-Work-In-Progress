const express = require("express");
const User = require("../models/user");
const ObjectID = require("mongodb").ObjectID;
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const checkAuth = require("../middleware/check-auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  getCategories,
  getSubcategoriesByCategory,
} = require("../controllers/categories");

const {
  getAdsByCategory,
  getAdsByUser,
  getAd,
  deleteAd,
  createAd,
  editAd,
  getAdsByUserWishlist,
} = require("../controllers/ads");

const {
  getUser,
  changeUserNameAndPhone,
  changeUserPassword,
  verifyUser,
  changeUserPicture,
  addItemToWishlist,
  removeItemFromWishlist,
} = require("../controllers/users");

app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

mongoose
  .connect(
    "mongodb+srv://user:Fishbone1@cloudads.1lviz.mongodb.net/class-ads?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("not connected");
  });

app.get("/categories", (req, res) => {
  return getCategories(req, res);
});

app.get("/ads/:categoryId", (req, res) => {
  return getAdsByCategory(req, res);
});

app.get("/categories/subcategories/:categoryId", (req, res) => {
  return getSubcategoriesByCategory(req, res);
});

app.get("/user/:userId", checkAuth, (req, res) => {
  return getUser(req, res);
});

app.get("/user/ads/:userId", checkAuth, (req, res) => {
  return getAdsByUser(req, res);
});

app.get("/ads/ad/:id", (req, res) => {
  return getAd(req, res);
});

app.delete("/ads/delete/:adId", checkAuth, (req, res) => {
  return deleteAd(req, res);
});

app.post("/ads/post", checkAuth, (req, res) => {
  return createAd(req, res);
});

app.put("/ads/edit/:adId", (req, res) => {
  return editAd(req, res);
});

app.post("/user/profile", checkAuth, (req, res) => {
  return changeUserNameAndPhone(req, res);
});

app.post("/user/password", checkAuth, (req, res) => {
  return changeUserPassword(req, res);
});

app.post("/user/profile/userPicture", (req, res) => {
  return changeUserPicture(req, res);
});

app.post("/login", async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
  const match = await bcrypt.compare(req.body.password, user.password);

  if (match) {
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      "new_token_created",
      { expiresIn: "1h" }
    );

    res.status(200).json({ ...user._doc, token: token });
  } else {
    res.status(401).json({
      message: "Wrong credentials",
    });
  }
});

app.post("/register", async (req, res, next) => {
  const user = await User.create(req.body);

  user.password = await bcrypt.hash(req.body.password, 10);

  const token = jwt.sign(
    { email: user.email, userId: user._id },
    "new_token_created",
    { expiresIn: "1h" }
  );

  user
    .save()
    .then((result) => {
      res.status(201).json({ ...result, token: token });
    })
    .catch((err) => {
      res.status(500).json({ error: "not working" });
    });
});

app.post("/user/verifyJwt", (req, res) => {
  return verifyUser(req, res);
});

app.put("/user/wishlist/:userId", (req, res) => {
  return addItemToWishlist(req, res);
});

app.get("/user/getWishlist/:userId", (req, res) => {
  return getAdsByUserWishlist(req, res);
});

app.listen(3000, () => console.log("listening"));
