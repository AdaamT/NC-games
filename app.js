const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  console.log(err, "<<<< Error");
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
