const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const { getReviewById } = require("./controllers/reviews.controller");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.use((err, req, res, next) => {
  console.log(err, "<<<< Error");
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
