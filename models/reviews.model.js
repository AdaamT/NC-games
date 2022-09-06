const db = require("../db/connection");
const format = require("pg-format");

exports.selectReviewById = (reviewId) => {
  const formatQuery = format(
    `SELECT * FROM reviews
  WHERE review_id = %L;`,
    [reviewId]
  );
  return db.query(formatQuery).then((results) => {
    return results.rows[0];
  });
};
