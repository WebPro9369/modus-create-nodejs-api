const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();
app.use(bodyParser.json());

const errorHandler = (err, req, res, next) => {
  const { status } = err.response;

  // Return an empty response instead of error when bad data is passed
  if (status === 400) {
    return res.json({
      Count: 0,
      Results: []
    });
  }

  res.status(500).send({ error: err.message });
};
app.use("/", routes);
app.use(errorHandler);
app.listen(8888, () => {
  console.log("Server running on port 8888");
});
