const db = require("../db/connection");

exports.selectReviews = (category) => {
  let formatStr = `SELECT reviews. *, COUNT(comments) ::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  let queryValue = [];
  const validCategories = [
    "euro game",
    "strategy",
    "hidden-roles",
    "dexterity",
    "push-your-luck",
    "roll-and-write",
    "deck-building",
    "engine-building",
    "children's games",
  ];

  if (category) {
    if (!validCategories.includes(category)) {
      return Promise.reject({
        status: 404,
        msg: `${category} not found`,
      });
    } else {
      formatStr += ` WHERE category = $1`;
      queryValue.push(category);
    }
  }
  formatStr += ` GROUP BY reviews.review_id ORDER BY created_at DESC`;

  return db
    .query(formatStr, queryValue)

    .then((results) => {
      return results.rows;
    });
};

exports.selectReviewById = (reviewId) => {
  return db
    .query(
      `SELECT reviews. *, COUNT(comments) ::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
      [reviewId]
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

exports.selectCommentsById = (review_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at ASC`,
      [review_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
