// ================================================================================
// Project: Stable Diffusion Discord Bot
// File: generateImage.js
// Description: Generate an image from the stable diffusion api
// Author: Nolan Olhausen
// ================================================================================

// Require necessaries
const sendRequest = require("./sendRequest");

/**
 *
 * @param {string} route The SD api route e.g "sdapi/v1/txt2img".
 * @param {object} requestData JSON data to be sent with axios request to api.
 */
module.exports = async (route, requestData) => {
  // Send generate request and get image
  const imageData = await sendRequest(route, requestData);

  return imageData;
};
