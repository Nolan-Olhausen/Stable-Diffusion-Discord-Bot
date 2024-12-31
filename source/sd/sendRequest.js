// ================================================================================
// Project: Stable Diffusion Discord Bot
// File: sendRequest.js
// Description: Make a request to the SD API.
// Author: Nolan Olhausen
// ================================================================================

// Require necessaries
const { baseUrl, port } = require("../../stableConfig.json");
const axios = require("axios");

/**
 * Make a request to the SD API.
 * @param {string} path API URL path
 * @param {object} data Data to be sent
 * @param {import('axios').Method} method
 * @returns {Promise<object>}
 */
module.exports = async (path, data = {}, method = "post") => {
  try {
    // Get response
    const response = await axios({
      method: method,
      url: `${baseUrl}:${port}/${path}`,
      data: data,
    });
    return response.data;
  } catch (error) {
    console.error(`Request to ${path} failed:`, error.message);
    return null;
  }
};
