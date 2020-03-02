const axios = require("axios");

/**
 *
 * @param {Object} data : API response of https://one.nhtsa.gov/webapi/api/SafetyRatings/VehicleId/<VehicleId>?format=json
 * @returns {Object} : new object with keys being vehicle ids and values being overall ratings
 */
const getOverallRatings = data => {
  if (!data) {
    return null;
  }

  const result = {};

  data.forEach(item => {
    const { Results } = item;

    if (!Results || Results.length < 1) {
      return false;
    }

    const { OverallRating, VehicleId } = Results[0];
    result[VehicleId] = OverallRating;
  });

  return result;
};

/**
 *
 * @param {Object} vehiclesData : API response of https://one.nhtsa.gov/webapi/api/SafetyRatings/modelyear/<MODELYEAR>/make/<MANUFACTURER>/model/<MODEL>?format=json
 * @param {Object} ratingsData : API repsonse of https://one.nhtsa.gov/webapi/api/SafetyRatings/VehicleId/<VehicleId>?format=json
 * @returns {Object} : formatted vehicles data
 */
const formatVehiclesData = (vehiclesData, ratingsData) => {
  if (!vehiclesData) {
    return {
      Count: 0,
      Results: []
    };
  }

  let overallRatings = null;
  const { Count, Results = [] } = vehiclesData;

  if (ratingsData) {
    overallRatings = getOverallRatings(ratingsData);
  }

  const formattedResults = Results.map(item => {
    const { VehicleDescription, VehicleId } = item;
    const formattedItem = {
      Description: VehicleDescription,
      VehicleId: VehicleId
    };

    if (overallRatings && overallRatings[VehicleId]) {
      formattedItem.CrashRating = overallRatings[VehicleId];
    }

    return formattedItem;
  });

  return {
    Count,
    Results: formattedResults
  };
};

const fetchVehiclesData = (modelYear, manufacturer, model) => {
  const url = `https://one.nhtsa.gov/webapi/api/SafetyRatings/modelyear/${modelYear}/make/${manufacturer}/model/${model}?format=json`;
  return axios.get(url);
};

const fetchRatingsData = vehicleId => {
  axios.get(
    `https://one.nhtsa.gov/webapi/api/SafetyRatings/VehicleId/${VehicleId}?format=json`
  );
};

module.exports = { formatVehiclesData, fetchVehiclesData, fetchRatingsData };
