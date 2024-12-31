// ================================================================================
// Project: Stable Diffusion Discord Bot
// File: gen.js
// Description: Slash command to generate an image
// Author: Nolan Olhausen
// ================================================================================

// Require necessaries
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const generateImage = require("../../sd/generateImage.js");
const imageToAttachment = require("../../sd/imageToAttachment.js");
const configure = require("../../sd/configure.js");
const fetchChoices = require("../../utility/fetchChoices.js");
const sanitizeUrl = require("../../utility/sanitizeUrl.js");
const getBase64ImageData = require("../../utility/getBase64ImageData.js");

async function generate() {
  // Fetch dynamic data
  const [models, samplers, schedulers] = await fetchChoices();

  //Build slash command
  return new SlashCommandBuilder()
    .setName("gen")
    .setDescription("Generate an image")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("What to generate")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("negative_prompt").setDescription("What to avoid")
    )
    .addStringOption((option) =>
      option
        .setName("aspect_ratio")
        .setDescription("width x height")
        .addChoices(
          { name: "5:4", value: "1352x1080" },
          { name: "4:3", value: "1440x1080" },
          { name: "3:2", value: "1620x1080" },
          { name: "16:9", value: "1920x1080" },
          { name: "21:9", value: "2048x878" },
          { name: "1:1", value: "1080x1080" },
          { name: "4:5", value: "1080x1352" },
          { name: "3:4", value: "1080x1440" },
          { name: "2:3", value: "1080x1620" },
          { name: "9:16", value: "1080x1920" },
          { name: "9:21", value: "878x2048" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("model")
        .setDescription("Image model")
        .addChoices(...models)
    )
    .addStringOption((option) =>
      option.setName("img2img").setDescription("Provide image web URL")
    )
    .addNumberOption((option) =>
      option
        .setName("img2img_strength")
        .setDescription("Denoising strength")
        .setMinValue(0)
        .setMaxValue(1)
    )
    .addNumberOption((option) =>
      option
        .setName("seed")
        .setDescription("Seed for generation")
        .setMinValue(-1)
    )
    .addNumberOption((option) =>
      option
        .setName("cfg_scale")
        .setDescription(
          "1 to 30, higher values give ai more freedom from prompt"
        )
        .setMinValue(1)
        .setMaxValue(30)
    )
    .addNumberOption((option) =>
      option
        .setName("steps")
        .setDescription("1 to 60, how many iterations for the image")
        .setMinValue(1)
        .setMaxValue(60)
    )
    .addStringOption((option) =>
      option
        .setName("sampler")
        .setDescription("Image sample method")
        .addChoices(...samplers)
    )
    .addStringOption((option) =>
      option
        .setName("scheduler")
        .setDescription("Image schedule method")
        .addChoices(...schedulers)
    )
    .addIntegerOption((option) =>
      option
        .setName("clip_skip")
        .setDescription("Number of clip layers to skip")
        .setMinValue(1)
        .setMaxValue(12)
    );
}

module.exports = {
  async data() {
    return await generate(); // Await the generation of data
  },

  async execute(interaction) {
    // Start time
    const startTime = performance.now();

    // Get inputs
    const prompt = interaction.options.getString("prompt");
    const negative_prompt =
      interaction.options.getString("negative_prompt") ??
      "easynegative, (low quality, worst quality:1.4)";
    const aspect_ratioStr =
      interaction.options.getString("aspect_ratio") ?? "1080x1080";
    const [widthStr, heightStr] = aspect_ratioStr.split("x");
    const width = parseInt(widthStr, 10);
    const height = parseInt(heightStr, 10);
    const model =
      interaction.options.getString("model") ??
      "v1-5-pruned-emaonly.safetensors [6ce0161689]";
    const img2img = interaction.options.getString("img2img") ?? "";
    const img2img_strength =
      interaction.options.getNumber("img2img_strength") ?? 0.75;
    const seed = interaction.options.getNumber("seed") ?? -1;
    const cfg_scale = interaction.options.getNumber("cfg_scale") ?? 7;
    const steps = interaction.options.getNumber("steps") ?? 20;
    const sampler = interaction.options.getString("sampler") ?? "DPM++ 2M";
    const scheduler = interaction.options.getString("scheduler") ?? "Automatic";
    const clip_skip = interaction.options.getInteger("clip_skip") ?? 2;

    let generatedSeed = -1;
    // Seed handling, create random here so can use in embed
    if (seed === -1) {
      generatedSeed = Math.floor(Math.random() * 4294967295);
    }

    // Generate image
    let imageData = {};
    if (img2img != "") {
      // Sanitize img2img url
      let url =
        sanitizeUrl(interaction.options.getString("img2img"), false) ||
        "https://wallpapercave.com/wp/wp9414303.jpg"; // Rick roll if cant sanitize

      // Convert image from url into base64 encoded data
      let image = await getBase64ImageData(url);

      // Configure
      await interaction.reply({
        content: "Applying configuration settings...",
      });
      await configure({
        sd_model_checkpoint: model,
        CLIP_stop_at_last_layers: clip_skip,
      });

      // Generate
      await interaction.editReply({
        content: "Waiting for Stable Diffusion Img2Img...",
      });
      imageData = await generateImage("sdapi/v1/img2img", {
        prompt: prompt,
        negative_prompt: negative_prompt,
        init_images: [image],
        width: width,
        height: height,
        seed: generatedSeed,
        cfg_scale: cfg_scale,
        steps: steps,
        sampler_name: sampler,
        scheduler: scheduler,
        denoising_strength: img2img_strength,
      });
    } else {
      // Configure
      await interaction.reply({
        content: "Applying configuration settings...",
      });
      await configure({
        sd_model_checkpoint: model,
        CLIP_stop_at_last_layers: clip_skip,
      });

      // Generate
      await interaction.editReply({
        content: "Waiting for Stable Diffusion Txt2Img...",
      });
      imageData = await generateImage("sdapi/v1/txt2img", {
        prompt: prompt,
        negative_prompt: negative_prompt,
        width: width,
        height: height,
        seed: generatedSeed,
        cfg_scale: cfg_scale,
        steps: steps,
        sampler_name: sampler,
        scheduler: scheduler,
      });
    }

    // Get user
    const user = interaction.member;
    const nickname = user.displayName ?? interaction.user.username;
    const userPFP = interaction.member.displayAvatarURL({ dynamic: true });

    // Bot info
    const bot = await interaction.guild.members.fetch("1249143195389137048");
    const botNickname = bot.displayName;
    const botPFP = bot.displayAvatarURL({ dynamic: true });

    // Attachment
    const imageBase64 = imageData.images[0];
    const imageAttachment = await imageToAttachment(
      imageBase64,
      "png",
      `image`
    );

    // Get image info/parameters, instead of printing user input,
    // Get what SD generated with to ensure input was actually used
    const imageParams = JSON.parse(imageData.info);

    // End time
    const endTime = performance.now();
    const duration = endTime - startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    const formattedDuration = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    // Build Embed
    const embed = new EmbedBuilder()
      .setColor(0x9e41ff)
      .setTitle(`${nickname}'s Generation (Took: ${formattedDuration})`)
      .setAuthor({ name: `${botNickname}`, iconURL: botPFP })
      .addFields(
        {
          name: "Model",
          value: imageParams.sd_model_name.toString(),
          inline: true,
        },
        {
          name: "Clip Skip",
          value: imageParams.clip_skip.toString(),
          inline: true,
        },
        { name: "\u200A", value: "\u200A" }, // thinnest unicode to move to next line without xtra line space
        { name: "Prompt", value: imageParams.prompt.toString() },
        {
          name: "Negative Prompt",
          value: imageParams.negative_prompt.toString(),
        },
        {
          name: "Sampler",
          value: imageParams.sampler_name.toString(),
          inline: true,
        },
        {
          name: "Scheduler",
          value: imageParams.infotexts[0]
            .match(/Schedule type:\s*([^,]+)/)[1]
            .toString(),
          inline: true,
        },
        { name: "Steps", value: imageParams.steps.toString(), inline: true },
        { name: "\u200A", value: "\u200A" },
        { name: "Dimensions", value: `${width} x ${height}`, inline: true },
        {
          name: "CFG Scale",
          value: imageParams.cfg_scale.toString(),
          inline: true,
        },
        { name: "Seed", value: `${generatedSeed} `, inline: true },
        { name: "\u200A", value: "\u200A" },
        { name: "Img2Img URL", value: `${img2img} `, inline: true },
        {
          name: "Img2Img Denoising Strength",
          value:
            imageParams.denoising_strength !== null
              ? imageParams.denoising_strength.toString()
              : `${img2img_strength}`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: `${nickname}`, iconURL: userPFP })
      .setImage("attachment://image.png");

    // Build buttons
    const redoBtn = new ButtonBuilder()
      .setCustomId("redoImage")
      .setLabel("Redo")
      .setEmoji("🔁")
      .setStyle(ButtonStyle.Primary);

    const saveBtn = new ButtonBuilder()
      .setCustomId("saveImage")
      .setLabel("Save")
      .setEmoji("💾")
      .setStyle(ButtonStyle.Secondary);

    // Build button row
    const row = new ActionRowBuilder().addComponents(redoBtn, saveBtn);

    await interaction.editReply({
      embeds: [embed],
      files: [imageAttachment],
      components: [row],
    });
  },
};
