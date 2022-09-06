const db = require("../db/connection");
const format = require("pg-format");

exports.selectReviewById = (reviewId) => {
  const formatQuery = format(
    `SELECT * FROM reviews
  WHERE review_id = %L;`,
    [reviewId]
  );
  return db.query(formatQuery).then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Bad request" });
    }
    return results.rows[0];
  });
};
