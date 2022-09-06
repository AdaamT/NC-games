exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(404).send({ msg: "Bad request" });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err, "<<<< ERROR");
  res.status(500).send({ msg: "Internal Server Error" });
};
