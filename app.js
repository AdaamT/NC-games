const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const { getReviewById } = require("./controllers/reviews.controller");
const { handlePsqlErrors, handleServerErrors } = require("./errors/index.js");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
