const { selectReview } = require("");

exports.getReviews = (req, res, next) => {
  selectCategories()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};
