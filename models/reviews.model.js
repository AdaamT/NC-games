const db = require("../db/connection");
const format = require("pg-format");

exports.selectReviewById = (reviewId) => {
  return db
    .query(
      `SELECT reviews. *, COUNT(comment_count) AS comment_count FROM reviews LEFT JOIN comments ON review_id = reviews.review_id WHERE review_id = $1 GROUP BY reviews.review_id;`,
      [reviewId]
    )
    .then((results) => {
      console.log(results);
      const review = results.rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${reviewId}`,
        });
      }
      return review;
    });
};

exports.updateVoteCount = (reviewId, voteCount) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
      [voteCount, reviewId]
    )
    .then((results) => {
      const review = results.rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${reviewId}`,
        });
      }
      return review;
    });
};
