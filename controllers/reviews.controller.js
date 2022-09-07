const {
  selectReviewById,
  updateVoteCount,
} = require("../models/reviews.model");

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
  console.log(req.params);
  updateVoteCount()
    .then(() => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
