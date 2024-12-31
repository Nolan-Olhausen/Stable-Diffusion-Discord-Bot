// ================================================================================
// Project: Stable Diffusion Discord Bot
// File: imageToAttachment.js
// Description: Turns a Base64 encoded image into an attachment.
// Author: Nolan Olhausen
// ================================================================================

// Require necessaries
const { AttachmentBuilder, Attachment } = require("discord.js");
const sharp = require("sharp");

/**
 * Turns a Base64 encoded image into an attachment.
 * @param {String} encodedString Base64 encoded image string.
 * @param {keyof sharp.FormatEnum|String} resultFormat The image format to return the buffer as, default png.
 * @param {String} filename The filename of the atachment, default is 'image'.
 * @returns {Promise<Attachment>}
 */
module.exports = async (
  encodedString,
  resultFormat = "png",
  filename = "image"
) => {
  // Get buffer
  const buffer = Buffer.from(encodedString, "base64");

  // Get image
  const bufferAsImage = await sharp(buffer).toFormat(resultFormat).toBuffer();

  // Create attachment
  const attachment = new AttachmentBuilder(bufferAsImage, {
    name: `${filename}.${resultFormat}`,
    description: "",
  });

  return attachment;
};
