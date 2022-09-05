const db = require("../db/connection");
const format = require("pg-format");

exports.selectReviews = () => {
  return db.query(`SELECT * FROM reviews`).then((results) => {
    return results.rows;
  });
};
