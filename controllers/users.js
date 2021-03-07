const User = require("../models/user");
const bcrypt = require("bcrypt");
const { decode } = require("punycode");
const jwt = require("jsonwebtoken");

exports.getUser = async (req, res, next) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);

    if (!user) {
      return res.status(500).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.changeUserNameAndPhone = async (req, res, next) => {
  await User.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: { name: req.body.name, phone: req.body.phone },
    },
    function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).send({
          message:
            "There was an error trying to change the name and the phone.",
        });
      } else {
        res.status(200).send(data);
      }
    }
  );
};

exports.changeUserPassword = async (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(async (hash) => {
    await User.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: { password: hash },
      },
      function (err, data) {
        if (err) {
          console.log(err);
          res.status(500).send({
            message: "There was an error trying to change the password.",
          });
        } else {
          res.status(200).send(data);
        }
      }
    );
  });
};

exports.verifyUser = async (req, res) => {
  const token = req.body.value;
  const decoded = await jwt.verify(token, "new_token_created");

  if (decoded) {
    const user = await User.findOne({ _id: decoded.userId });

    return res.status(200).json(user);
  }
};

exports.changeUserPicture = async (req, res, next) => {
  await User.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: { picture: req.body.picture },
    },
    function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).send({
          message: "There was an error trying to change the password.",
        });
      } else {
        res.status(200).send(data);
      }
    }
  );
};

exports.addItemToWishlist = async (req, res) => {
  const user = await User.findById({ _id: req.params.userId });
  const foundAd = user.wishlist.find((listItem) => {
    return String(listItem) === String(req.body.adId);
  });

  if (foundAd) {
    await User.findOneAndUpdate(
      {
        _id: req.params.userId,
      },
      {
        $pull: { wishlist: req.body.adId },
      },
      {
        new: true,
      }
    );
    return res.status(200).send();
  } else {
    await User.findOneAndUpdate(
      {
        _id: req.params.userId,
      },
      {
        $addToSet: { wishlist: req.body.adId },
      },
      {
        new: true,
      }
    );
    return res.status(200).send();
  }
};
