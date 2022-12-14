const express = require("express");

const cors = require("cors");

const { getCategories } = require("./controllers/categories.controller");

const {
  getReviews,
  getReviewById,
  updateReview,
  getCommentsById,
  postCommentById,
} = require("./controllers/reviews.controller");

const { deleteCommentById } = require("./controllers/comments.controller");

const { getUsers } = require("./controllers/users.controller");

const { getAPI } = require("./controllers/endpoints.controller");

const {
  handlePsqlErrors,
  handleServerErrors,
  handleCustomErrors,
} = require("./errors/index.js");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", getAPI);

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", updateReview);

app.get("/api/users", getUsers);

app.get("/api/reviews/:review_id/comments", getCommentsById);
app.post("/api/reviews/:review_id/comments", postCommentById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
