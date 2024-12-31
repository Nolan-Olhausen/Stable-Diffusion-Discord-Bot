// ================================================================================
// Project: Stable Diffusion Discord Bot
// File: configure.js
// Description: Configure the stable diffusion process
// Author: Nolan Olhausen
// ================================================================================

// Require necessaries
const sendRequest = require("./sendRequest");

/**
 * @param {object} changes Key value pairs for changes
 */
module.exports = async (changes) => {
  // Get current
  let options = await sendRequest("sdapi/v1/options", {}, "get");

  // Update changes in options
  Object.keys(changes).forEach((optionName) => {
    options[optionName] = changes[optionName];
  });

  await sendRequest("sdapi/v1/options", options, "post");
};
