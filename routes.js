const express = require("express");
const axios = require("axios");

const router = express.Router();
const utils = require("./utils");

router.get("/vehicles/:model_year/:manufacturer/:model", (req, res, next) => {
  const { model_year, manufacturer, model } = req.params;
  const { withRating } = req.query;

  utils
    .fetchVehiclesData(model_year, manufacturer, model)
    .then(response => {
      const { data } = response;

      if (withRating) {
        const promises = data.Results.map(item =>
          utils.fetchRatingsData(item.VehicleId)
        );

        return Promise.all(promises)
          .then(ratingResponse => {
            const ratingsData = ratingResponse.map(r => r.data);
            res.json(utils.formatVehiclesData(data, ratingsData));
          })
          .catch(next);
      }

      const formattedData = utils.formatVehiclesData(data);
      return res.json(formattedData);
    })
    .catch(next);
});

router.post("/vehicles", (req, res, next) => {
  const { modelYear, manufacturer, model } = req.body;

  utils
    .fetchVehiclesData(modelYear, manufacturer, model)
    .then(response => {
      res.json(utils.formatVehiclesData(response.data));
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
