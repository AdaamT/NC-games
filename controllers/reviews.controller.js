const {
  selectReviews,
  selectReviewById,
  updateVoteCount,
  selectCommentsById,
  insertCommentById,
} = require("../models/reviews.model");

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;
  const promises = [selectReviews(category, sort_by, order)];
  Promise.all(promises)
    .then((reviews) => {
      res.status(200).send({ reviews: reviews[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateReview = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateVoteCount(review_id, inc_votes)
    .then((updatedReview) => {
      res.status(200).send({ updatedReview });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsById = (req, res, next) => {
  selectReviewById(req.params.review_id)
    .then(() => {
      return selectCommentsById(req.params.review_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentById = (req, res, next) => {
  selectReviewById(req.params.review_id)
    .then(() => {
      return insertCommentById(req.params.review_id, req.body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
