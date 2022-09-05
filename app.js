const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const { getReviews } = require("./controllers/reviews.controller");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviews);

app.use((err, req, res, next) => {
  console.log(err, "<<<< Error");
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
