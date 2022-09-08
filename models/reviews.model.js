const db = require("../db/connection");
const format = require("pg-format");

exports.selectReviewById = (reviewId) => {
  const formatQuery = format(
    `SELECT * FROM reviews
  WHERE review_id = %L;`,
    [reviewId]
  );
  return db.query(formatQuery).then((results) => {
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
