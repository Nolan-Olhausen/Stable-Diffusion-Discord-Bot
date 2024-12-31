// ================================================================================
// Project: Stable Diffusion Discord Bot
// File: getBase64ImageData.js
// Description: Get base64 encoding from a url.
// Author: Nolan Olhausen
// ================================================================================

// Require necessaries
const axios = require("axios");

// Get base64 encoding from a url
module.exports = async (url) => {
  try {
    // Get response from url
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    // Create buffer and convert to string
    const buffer = Buffer.from(response.data, "binary");
    const base64EncodedData = buffer.toString("base64");

    return base64EncodedData;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};
