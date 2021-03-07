const Ad = require("../models/ad");
const User = require("../models/user");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");

exports.getAdsByCategory = async (req, res, next) => {
  try {
    const count = await Ad.find({ categoryId: req.params.categoryId }).count();
    const subcategoriesByParam = await Subcategory.find({
      _id: { $in: req.query.subcategories },
    });
    const ads = [];

    if (subcategoriesByParam.length) {
      for (let i = 0; i < subcategoriesByParam.length; i++) {
        const ad = await Ad.find({
          subcategoryId: subcategoriesByParam[i]._id,
        });
        if (ad) {
          ads.unshift(...ad);
        }
      }
    } else {
      const adsByCategory = await Ad.find({
        categoryId: req.params.categoryId,
      });

      ads.push(...adsByCategory);
    }

    // const ads = await Ad.find({
    //   subcategoryId: { $in: subcategoriesByParam },
    // });

    // .skip(+req.query.offset)
    // .limit(3);

    const category = await Category.findOne({ _id: req.params.categoryId });

    const subcategories = await Subcategory.find({
      _id: { $in: category.subcategoriesIds },
    });

    return res.status(200).json({ ads, subcategories, count });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.getAdsByUser = async (req, res, next) => {
  try {
    const ads = await Ad.find({ userId: req.params.userId });

    return res.status(200).json(ads);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.getAd = async (req, res, next) => {
  try {
    const ad = await Ad.findOneAndUpdate(
      { _id: req.params.id },
      {
        $inc: { views: 1 },
      },
      { new: true }
    );

    return res.status(200).json(ad);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.deleteAd = async (req, res, next) => {
  await Ad.deleteOne({ _id: req.params.adId });

  res.status(201).json({});
};

exports.createAd = async (req, res) => {
  const ad = await Ad.create(req.body);

  if (!ad) {
    return res.status(500).json({ message: "There was an error!" });
  } else {
    return res.status(200).json({});
  }
};

exports.editAd = async (req, res) => {
  try {
    await Ad.updateOne(
      { _id: req.params.adId },
      {
        $set: {
          title: req.body.title,
          price: req.body.price,
          thumbnail: req.body.thumbnail,
          description: req.body.description,
          photos: req.body.photos,
          userId: req.body.userId,
          categoryId: req.body.categoryId,
          subcategoryId: req.body.subcategoryId,
          sponsored: req.body.sponsored,
        },
      },
      {
        upsert: false,
      }
    );
    return res.status(200).json({});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There was a problem trying to update the ad" });
  }
};

exports.getAdsByUserWishlist = async (req, res, next) => {
  try {
    const ads = [];

    const user = await User.findById({ _id: req.params.userId });

    for (let i = 0; i < user.wishlist.length; i++) {
      const ad = await Ad.findOne({ _id: user.wishlist[i] });

      if (ad) {
        ads.push(ad);
      }
    }

    return res.status(200).json(ads);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};
