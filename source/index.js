// ================================================================================
// Project: Stable Diffusion Discord Bot
// File: index.js
// Description: Main file for the Stable Diffusion Discord Bot.
// Author: Nolan Olhausen
// ================================================================================

// Require necessaries
require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  EmbedBuilder,
  User,
  ActionRowBuilder,
  ButtonBuilder,
  GatewayIntentBits,
  ButtonStyle,
} = require("discord.js");
const axios = require("axios");
const https = require("https");
const { baseUrl, port, extensionConfigs } = require("../stableConfig.json");
const imageDataFromEmbed = require("./utility/imageDataFromEmbed.js");
const generateImage = require("./sd/generateImage.js");
const getBase64ImageData = require("./utility/getBase64ImageData.js");
const imageToAttachment = require("./sd/imageToAttachment.js");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// SD checks
(async () => {
  // SD process check
  await axios
    .get(`${baseUrl}:${port}/internal/ping`)
    .then((response) => {
      console.log(`${response.status}: SD running`);
    })
    .catch((error) => {
      if (error.code == "DEPTH_ZERO_SELF_SIGNED_CERT") {
        const autoTlsHttpsConfig = extensionConfigs.autoTlsHttps;

        try {
          const certFile = fs.readFileSync(autoTlsHttpsConfig.certFilePath);
          const keyFile = fs.readFileSync(autoTlsHttpsConfig.keyFilePath);
          const caFile = fs.readFileSync(autoTlsHttpsConfig.caFilePath);

          axios.defaults.httpsAgent = new https.Agent({
            cert: certFile,
            key: keyFile,
            ca: caFile,
          });

          console.log("SSL good");
          return;
        } catch (err) {
          if (err.code === "ENOENT") {
            console.warn("SSL cert files not set or unavailable, ignoring");
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
          }
        }
      } else {
        console.error(`${error.code}: No running SD found`);
        process.exit([1]);
      }
    });

  // API check
  await axios
    .get(`${baseUrl}:${port}/docs`)
    .then((response) => {
      console.log(`${response.status}: API good`);
    })
    .catch((error) => {
      console.error(`${error.response.status}: API not enabled or found`);
      process.exit([1]);
    });
})();

// Collection for commands
client.commands = new Collection();

// Get commands
(async () => {
  // Dynamically retrieve commands from directory
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        // wait for promise
        try {
          const data = await command.data(); // Await the data resolution

          if (data) {
            client.commands.set(data.name, command);
            console.log(`Setting command ${data.name}`);
          } else {
            console.log(
              `Failed to set command ${filePath}: data is undefined.`
            );
          }
        } catch (error) {
          console.error(`Error setting command ${filePath}:`, error);
        }
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
})();

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Command Listener
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isCommand()) {
    // Set command
    const command = interaction.client.commands.get(interaction.commandName);

    // Does not exist
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    // Execute
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  } else if (interaction.isStringSelectMenu()) {
    // Handle select menu interactions here
    const command = client.commands.get("sdinfo");

    // Pass to select menu handler
    if (command && command.handleSelectMenu) {
      try {
        await command.handleSelectMenu(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error handling the select menu!",
          ephemeral: true,
        });
      }
    }
  } else if (interaction.isButton()) {
    // Handle save image
    if (interaction.customId === "saveImage") {
      // Get message
      const interactionMsg = interaction.message;

      // Create buttons
      const downloadBtn = new ButtonBuilder()
        .setURL(interaction.message.embeds[0].image.url)
        .setLabel("Download")
        .setStyle(ButtonStyle.Link);
      const sendToDM = new ButtonBuilder()
        .setCustomId("saveImageToDM")
        .setLabel("Save to DM")
        .setEmoji("📥")
        .setStyle(ButtonStyle.Primary);

      // Create button row
      const row = new ActionRowBuilder().addComponents(downloadBtn, sendToDM);

      interaction.reply({
        content: interactionMsg.id,
        ephemeral: true,
        components: [row],
      });
      // Handle redo image
    } else if (interaction.customId === "redoImage") {
      await interaction.reply({ content: "Redoing..." });

      // Get original inputs
      const originalData = await imageDataFromEmbed(
        interaction.message.embeds[0]
      );

      // Create new seed
      originalData.seed = Math.floor(Math.random() * 4294967295);

      let imageData = {};
      if (originalData.init_images == "") {
        let img2img = "";
        const startTime = performance.now();
        imageData = await generateImage("sdapi/v1/txt2img", originalData);
        // Get user
        const user = interaction.member;
        const nickname = user.displayName ?? interaction.user.username;
        const userPFP = interaction.member.displayAvatarURL({ dynamic: true });

        // Bot info
        const bot = await interaction.guild.members.fetch(
          "1249143195389137048"
        );
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
        const formattedDuration = `${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`;

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
            {
              name: "Steps",
              value: imageParams.steps.toString(),
              inline: true,
            },
            { name: "\u200A", value: "\u200A" },
            {
              name: "Dimensions",
              value: `${originalData.width} x ${originalData.height}`,
              inline: true,
            },
            {
              name: "CFG Scale",
              value: imageParams.cfg_scale.toString(),
              inline: true,
            },
            { name: "Seed", value: `${originalData.seed} `, inline: true },
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
      } else if (originalData.init_images != "") {
        let img2img = originalData.init_images;
        const startTime = performance.now();
        let image = await getBase64ImageData(originalData.init_images);
        originalData.init_images = [image];
        imageData = await generateImage("sdapi/v1/img2img", originalData);
        // Get user
        const user = interaction.member;
        const nickname = user.displayName ?? interaction.user.username;
        const userPFP = interaction.member.displayAvatarURL({ dynamic: true });

        // Bot info
        const bot = await interaction.guild.members.fetch(
          "1249143195389137048"
        );
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
        const formattedDuration = `${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`;

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
            {
              name: "Steps",
              value: imageParams.steps.toString(),
              inline: true,
            },
            { name: "\u200A", value: "\u200A" },
            {
              name: "Dimensions",
              value: `${originalData.width} x ${originalData.height}`,
              inline: true,
            },
            {
              name: "CFG Scale",
              value: imageParams.cfg_scale.toString(),
              inline: true,
            },
            { name: "Seed", value: `${originalData.seed} `, inline: true },
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
      }
      // Handle save to DM
    } else if (interaction.customId === "saveImageToDM") {
      if (interaction.channel && interaction.member) {
        // Get message to send
        const msgToSaveEmbed = await interaction.channel.messages.fetch(
          interaction.message.content
        );

        if (interaction.member.user instanceof User) {
          interaction.member.user.send({
            content: "",
            embeds: [msgToSaveEmbed.embeds[0]],
          });
        }
      }
    }
  }
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
