const db = require("../db/connection");
const format = require("pg-format");

exports.selectReviews = (category) => {
  let formatStr = `SELECT reviews. *, COUNT(comments) ::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  let queryValue = [];

  if (category) {
    formatStr += ` WHERE category = $1`;
    queryValue.push(category);
  }
  formatStr += ` GROUP BY reviews.review_id ORDER BY created_at DESC`;

  return db
    .query(`SELECT * FROM categories`)
    .then(({ rows }) => {
      const allCategories = rows.map((category) => {
        return category.slug;
      });
      if (!allCategories.includes(category)) {
        return Promise.reject({ status: 404, msg: `${category} not found` });
      }
      return db.query(formatStr, queryValue);
    })
    .then((results) => {
      return results.rows;
    });
};

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
