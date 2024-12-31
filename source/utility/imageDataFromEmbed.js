// ================================================================================
// Project: Stable Diffusion Discord Bot
// File: imageDataFromEmbed.js
// Description: Get image data from an embed.
// Author: Nolan Olhausen
// ================================================================================

// Require necessaries
const axios = require("axios");
const { Embed } = require("discord.js");

/**
 *
 * @param {Embed} embed
 * @param {boolean} returnImageB64
 * @returns {Promise<object>}
 */
module.exports = async (embed, img2imgBool = false, returnImageB64 = false) => {
  // Get fields from embed
  const embedFields = embed.fields;

  // Get image from embed
  const embedImage = embed.image;

  // Split dimensions
  const [widthStr, heightStr] = embedFields[9].value.split("x");
  const width = parseInt(widthStr, 10);
  const height = parseInt(heightStr, 10);

  // Setup data from generation (embed field numbers relate to constructed embed in gen.js)
  const data = {
    prompt: embedFields[3].value,
    negative_prompt: embedFields[4].value,
    init_images: embedFields[13].value,
    width: width,
    height: height,
    seed: embedFields[11].value,
    cfg_scale: embedFields[10].value,
    steps: embedFields[7].value,
    sampler_name: embedFields[5].value,
    scheduler: embedFields[6].value,
    denoising_strength: embedFields[14].value,
  };

  if (returnImageB64) {
    const response = await axios.get(embedImage.url, {
      responseType: "arraybuffer",
    });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    data.image = base64;
  }

  return data;
};
