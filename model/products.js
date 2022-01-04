const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "A product should have a name"],
  },
  price: {
    type: Number,
    required: [true, "A product should have a price"],
  },
  description: {
    type: String,
    required: [true, "A product should have a description"],
    trim: true,
  },
  photos: [
    {
      id: {
        type: String,
        required: [true, "A product should have a photo id"],
      },
      secure_url: {
        type: String,
        required: [true, "A product should have a photo secure url"],
      },
    },
  ],
  videoLink: {
    type: String,
    default: "",
  },
  catagory: {
    type: String,
    enum: [
      "freeToPlay",
      "earlyAccess",
      "action",
      "adventure",
      "casual",
      "indie",
      "massivelyMultiplayer",
      "racing",
      "simulation",
      "RPG",
      "sports",
      "statigy",
    ],
    default: "freeToPlay",
  },
  brand: {
    type: String,
    required: [true, "A product should have a brand"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
          type: Number,
          required: true,
      },
      text: {
          type: String,
          required: true,
          trim: true
      }
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Product", productSchema);
