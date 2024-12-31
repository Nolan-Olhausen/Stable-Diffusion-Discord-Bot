// ================================================================================
// Project: Stable Diffusion Discord Bot
// File: fetchChoices.js
// Description: Fetches the choices for the user to select from.
// Author: Nolan Olhausen
// ================================================================================

// Require necessaries
const sendRequest = require("../sd/sendRequest.js");

module.exports = async () => {
  try {
    // Get models, samplers, and schedulers dynamically on command deploy
    // Makes incorperating new models/updates easier
    const modelsAvailable = await sendRequest("sdapi/v1/sd-models", {}, "get");
    const samplersAvailable = await sendRequest("sdapi/v1/samplers", {}, "get");
    const schedulersAvailable = await sendRequest(
      "sdapi/v1/schedulers",
      {},
      "get"
    );

    // Extract the choices from the JSON data
    const modelChoices = modelsAvailable.map((model) => ({
      name: model.model_name,
      value: model.title,
    }));
    const samplerChoices = samplersAvailable.map((sampler) => ({
      name: sampler.name,
      value: sampler.name,
    }));
    const schedulerChoices = schedulersAvailable.map((scheduler) => ({
      name: scheduler.name,
      value: scheduler.name,
    }));

    return [modelChoices, samplerChoices, schedulerChoices];
  } catch (error) {
    console.error("Error fetching choices:", error);
    return [[], [], []];
  }
};
