// ================================================================================
// Project: Stable Diffusion Discord Bot
// File: sdinfo.js
// Description: Slash command for getting info on models, loras, embeddings, etc.
// Author: Nolan Olhausen
// ================================================================================

// Require necessaries
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  EmbedBuilder,
} = require("discord.js");

// Command data
function sdInfo() {
  return new SlashCommandBuilder()
    .setName("sdinfo")
    .setDescription("Get info on models, loras, embedings, etc. available");
}

module.exports = {
  // This cant be done dynamically unfortunately
  // The GET loras/embeddings/etc. api calls dont return data related to model limitations
  // Most loras/embeddings/etc are not compatible with XL models, some are
  // So this needs to be manually updated as new loras/embeddings/etc added
  // Api calls also dont get necessary usage info, civitai names, or good descriptions
  // civitai descriptions often different language or not very helpful, so manually
  // creating these embeds and menus are better
  data() {
    return sdInfo(); // Await the generation of data
  },

  async execute(interaction) {
    // Get user
    const user = interaction.member;
    const nickname = user.displayName ?? interaction.user.username;
    const userPFP = interaction.member.displayAvatarURL({ dynamic: true });

    // Bot info
    const bot = await interaction.guild.members.fetch("1249143195389137048");
    const botNickname = bot.displayName;
    const botPFP = bot.displayAvatarURL({ dynamic: true });

    // Build initial select menu
    const infoSelect = new StringSelectMenuBuilder()
      .setCustomId("infoType")
      .setPlaceholder("Select the info type")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Models")
          .setDescription("Get info on available models")
          .setValue("Models"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Loras")
          .setDescription("Get info on available loras")
          .setValue("Loras"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Embeddings")
          .setDescription("Get info on available embeddings")
          .setValue("Embeddings")
      );

    // Build initial row
    const infoRow = new ActionRowBuilder().addComponents(infoSelect);

    // Build Embed
    const baseEmbed = new EmbedBuilder()
      .setColor(0x9e41ff)
      .setTitle("SD Info")
      .setAuthor({ name: `${botNickname}`, iconURL: botPFP })
      .addFields({
        name: "Instructions",
        value:
          "Start by selecting the type of " +
          "info you want. Model/Lora/Embedding info types require a model " +
          "to be selected due to loras and embeddings not being cross-compatible " +
          "between SD 1.5 and SD XL models. Based on the info type and model " +
          "selected, compatible lora/embedding lists will be provided for model, " +
          "allowing you to select a lora/embedding for info such as usage, " +
          "description, and an example image. Model info will provide info on " +
          "just the model with an example image.",
      })
      .setTimestamp()
      .setFooter({ text: `${nickname}`, iconURL: userPFP });

    await interaction.reply({
      content: " ",
      embeds: [baseEmbed],
      components: [infoRow],
    });
  },

  async handleSelectMenu(interaction) {
    // Get prev embed for field values
    const embed = interaction.message.embeds[0];
    const fields = embed.fields;

    // Get user
    const user = interaction.member;
    const nickname = user.displayName ?? interaction.user.username;
    const userPFP = interaction.member.displayAvatarURL({ dynamic: true });

    // Bot info
    const bot = await interaction.guild.members.fetch("1249143195389137048");
    const botNickname = bot.displayName;
    const botPFP = bot.displayAvatarURL({ dynamic: true });

    // Handle menu interactions
    if (interaction.customId === "infoType") {
      // Get interacted menu value
      selectedValue = interaction.values[0];

      // Build model select
      const modelSelect = new StringSelectMenuBuilder()
        .setCustomId("modelSelected")
        .setPlaceholder("Select model")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("AbyssOrangeMix3 (AOM3)")
            .setDescription("abyssorangemix3AOM3_aom3a1b")
            .setValue("AbyssOrangeMix3 (AOM3)"),
          new StringSelectMenuOptionBuilder()
            .setLabel("AnyLoRA - Checkpoint")
            .setDescription("anyloraCheckpoint_bakedvaeBlessedFp16")
            .setValue("AnyLoRA - Checkpoint"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Anything XL")
            .setDescription("AnythingXL_xl")
            .setValue("Anything XL"),
          new StringSelectMenuOptionBuilder()
            .setLabel("ChilloutMix")
            .setDescription("chilloutmix_Ni")
            .setValue("ChilloutMix"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Counterfeit-V3.0")
            .setDescription("counterfeitV30_v30")
            .setValue("Counterfeit-V3.0"),
          new StringSelectMenuOptionBuilder()
            .setLabel("CyberRealistic XL")
            .setDescription("cyberrealisticXL_v11VAE")
            .setValue("CyberRealistic XL"),
          new StringSelectMenuOptionBuilder()
            .setLabel("DreamShaper")
            .setDescription("dreamshaper_8")
            .setValue("DreamShaper"),
          new StringSelectMenuOptionBuilder()
            .setLabel("DreamShaper XL")
            .setDescription("dreamshaperXL_v21TurboDPMSDE")
            .setValue("DreamShaper XL"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Dungeons N Waifu's")
            .setDescription("dungeonsNWaifusV2225D_dungeonsNWaifus22")
            .setValue("Dungeons N Waifu's"),
          new StringSelectMenuOptionBuilder()
            .setLabel("epiCRealism")
            .setDescription("epicrealism_naturalSin")
            .setValue("epiCRealism"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Juggernaut")
            .setDescription("juggernaut_reborn")
            .setValue("Juggernaut"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Juggernaut XL")
            .setDescription("Juggernaut_X_RunDiffusion_Hyper")
            .setValue("Juggernaut XL"),
          new StringSelectMenuOptionBuilder()
            .setLabel("MeinaMix")
            .setDescription("meinamix_meinaV11")
            .setValue("MeinaMix"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Perfect World")
            .setDescription("perfectWorld_v6Baked")
            .setValue("Perfect World"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Realistic Vision")
            .setDescription("realisticVisionV60B1_v51HyperVAE")
            .setValue("Realistic Vision"),
          new StringSelectMenuOptionBuilder()
            .setLabel("ReV Animated")
            .setDescription("revAnimated_v2Rebirth")
            .setValue("ReV Animated"),
          new StringSelectMenuOptionBuilder()
            .setLabel("SD XL")
            .setDescription("sdXL_v10VAEFix")
            .setValue("SD XL"),
          new StringSelectMenuOptionBuilder()
            .setLabel("SD 1.5")
            .setDescription("v1-5-pruned-emaonly")
            .setValue("SD 1.5")
        );

      // Build model row
      const modelRow = new ActionRowBuilder().addComponents(modelSelect);

      // Build prevRow
      const infoRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder(
          interaction.component.toJSON()
        ).setPlaceholder(selectedValue)
      );

      // Build next embed
      const infoEmbed = new EmbedBuilder()
        .setColor(0x9e41ff)
        .setTitle("SD Info")
        .setAuthor({ name: `${botNickname}`, iconURL: botPFP })
        .addFields(
          { name: "Info Type", value: `${selectedValue}` },
          { name: "Model", value: "Select Below" }
        )
        .setTimestamp()
        .setFooter({ text: `${nickname}`, iconURL: userPFP });

      await interaction.update({
        content: " ",
        embeds: [infoEmbed],
        components: [infoRow, modelRow],
      });
    } else if (interaction.customId === "modelSelected") {
      // Get interacted menu value
      selectedValue = interaction.values[0];
      const firstSelectValue = fields.find(
        (field) => field.name === "Info Type"
      ).value;

      // Build array of 1.5 models and array of xl models for lora/embed info
      const sd15Array = [
        "AbyssOrangeMix3 (AOM3)",
        "SD 1.5",
        "ReV Animated",
        "Realistic Vision",
        "Perfect World",
        "MeinaMix",
        "Juggernaut",
        "epiCRealism",
        "Dungeons N Waifu's",
        "AnyLoRA - Checkpoint",
        "ChilloutMix",
        "Counterfeit-V3.0",
        "DreamShaper",
      ];
      const sdxlArray = [
        "Anything XL",
        "SD XL",
        "Juggernaut XL",
        "DreamShaper XL",
        "CyberRealistic XL",
      ];

      if (firstSelectValue === "Models") {
        // Build model constants
        const modelArray = [
          {
            modelName: "AbyssOrangeMix3 (AOM3)",
            modelCommandName: "abyssorangemix3AOM3_aom3a1b",
            modelBase: "SD 1.5",
            modelDescription:
              "Generally used for Anime like illustrations with a mix between oil and flat paint styles, but can generate a wide range of art styles.",
            modelRecommends:
              "Sampler(s): DPM++ SDE, DPM++ 2M\nScheduler(s): Karras\nSteps: 15-30\nClip Skip: 1-2\nNegative: nsfw, (worst quality, low quality:1.4), (realistic, lip, nose, tooth, rouge, lipstick, eyeshadow:1.0), (dusty sunbeams:1.0),, (abs, muscular, rib:1.0), (depth of field, bokeh, blurry:1.4),(motion lines, motion blur:1.4), (greyscale, monochrome:1.0), text, title, logo, signature",
            modelLink: "https://civitai.com/models/9942",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323455719869255783/175092.png?ex=677493b0&is=67734230&hm=913f8723c1bec52266ba4073442325f8b464fb9c4d49297c4c14899ace5ea125&",
          },
          {
            modelName: "AnyLoRA - Checkpoint",
            modelCommandName: "anyloraCheckpoint_bakedvaeBlessedFp16",
            modelBase: "SD 1.5",
            modelDescription:
              "Generally used for anime generation. Works well with a large variety of anime based style/character loras.",
            modelRecommends:
              "Sampler(s): DPM++ SDE\nScheduler(s): Karras\nSteps: 20-30\nClip Skip: 2",
            modelLink: "https://civitai.com/models/23900",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323455625623244902/3978531148-3187489593-arcane20style__1girl20arm20tattoo20asymmetrical20bangs20bangs20blue20hair20braid20brown20shirt20cloud20tattoo20looking20at20viewer20lau.png?ex=67749399&is=67734219&hm=4558655b2efb64117eba2797194359ae8bb7578f909db82e32b4946f385c413d&",
          },
          {
            modelName: "Anything XL",
            modelCommandName: "AnythingXL_xl",
            modelBase: "SD XL",
            modelDescription:
              "Generally used for anime generation with a flat art style.",
            modelRecommends:
              "Sampler(s): Euler a, DPM++ 2S a, DPM++ 2M\nScheduler(s): Karras\nSteps: 20-30\nClip Skip: 2\nNegative: nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name",
            modelLink: "https://civitai.com/models/9409",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323455519494770770/02857-3665112698.png?ex=67749380&is=67734200&hm=73de4da0d86f0b3d3f593fe40a74242325b1cefee4834b17994843ae3e9485b4&",
          },
          {
            modelName: "ChilloutMix",
            modelCommandName: "chilloutmix_Ni",
            modelBase: "SD 1.5",
            modelDescription: "Generally used for realistic asian girls.",
            modelRecommends:
              "Sampler(s): DPM++ SDE, DPM++ 2M\nScheduler(s): Karras\nSteps: 20-40",
            modelLink: "https://civitai.com/models/6424?modelVersionId=8958",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323455433595162756/00002-1052913388-enlarged.png?ex=6774936b&is=677341eb&hm=abb7659ebadba96c6e77de9b14a8d986e92dfc161366231a9abb770ff00f1b7b&",
          },
          {
            modelName: "Counterfeit-V3.0",
            modelCommandName: "counterfeitV30_v30",
            modelBase: "SD 1.5",
            modelDescription: "Generally used for anime illustrations.",
            modelRecommends:
              "Sampler(s): DPM++ 2M, Euler a\nScheduler(s): Karras\nSteps: 20-30\nNegative: easynegative",
            modelLink: "https://civitai.com/models/4468",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323453177290555478/007.png?ex=67749152&is=67733fd2&hm=4f2a2152ef5e8c19f5888c40c2103b44b11767d8d4c10aa21a838746fee94a04&",
          },
          {
            modelName: "CyberRealistic XL",
            modelCommandName: "cyberrealisticXL_v11VAE",
            modelBase: "SD XL",
            modelDescription:
              "Generally used for very realistic generations of people/environments.",
            modelRecommends:
              "Sampler(s): DPM++ 2M, DPM++ 2M SDE Huen, Euler a\nScheduler(s): Karras\nSteps: 30-40\nNegative: worst quality, low quality, normal quality, lowres, low details, oversaturated, undersaturated, overexposed, underexposed",
            modelLink: "https://civitai.com/models/312530",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323453068565676134/XL1.png?ex=67749138&is=67733fb8&hm=2c2d78df442658ae48b0ca3aaf340bc5b9c21fa68c9a2957d78944bda8d77488&",
          },
          {
            modelName: "DreamShaper",
            modelCommandName: "dreamshaper_8",
            modelBase: "SD 1.5",
            modelDescription:
              "Generally used for a mix between semi-realistic and illustrations.",
            modelRecommends:
              "Sampler(s): Huen, DPM++ 2M, DPM++ SDE\nScheduler(s): Karras\nSteps: 20-35\nClip Skip: 2",
            modelLink: "https://civitai.com/models/4384",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323452975594733679/26072224-5775713-masterpiece20extremely20intricate_1.png?ex=67749121&is=67733fa1&hm=b87f6b86e19de7a4115ab8100a4a4f82bcbccbe3c7d0e4004cbe36cd64aadd73&",
          },
          {
            modelName: "DreamShaper XL",
            modelCommandName: "dreamshaperXL_v21TurboDPMSDE",
            modelBase: "SD XL",
            modelDescription:
              "Generally used for a mix between semi-realistic and illustrations.",
            modelRecommends:
              "Sampler(s): DPM++ SDE\nScheduler(s): Karras\nSteps: 4-8\nCFG Scale: 2",
            modelLink: "https://civitai.com/models/112902",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323452880526774335/31072150-554464390-In20Casey20Baugh27s20evocative20style20art20of20a20beautiful20young20girl20cyborg20with20long20brown20hair20futuristic20scifi20intricate20elega.png?ex=6774910b&is=67733f8b&hm=10e1a40b9f782bd5c2e66c68d4bff56354e66a20417dd9b471a5f9d2d50a24f9&",
          },
          {
            modelName: "Dungeons N Waifu's",
            modelCommandName: "dungeonsNWaifusV2225D_dungeonsNWaifus22",
            modelBase: "SD 1.5",
            modelDescription:
              "Generally used to generate fantasy characters/creatures, and worlds.",
            modelRecommends:
              "Sampler(s): DPM++ 2M, Euler a, DPM++ SDE, DDIM\nScheduler(s): Karras\nSteps: 30-45",
            modelLink: "https://civitai.com/models/11718",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323452784913420370/260897.png?ex=677490f4&is=67733f74&hm=e2c5a89329319163a5de7e9bb16c9d65ecc221fd532ed70397709f410febc1db&",
          },
          {
            modelName: "epiCRealism",
            modelCommandName: "epicrealism_naturalSin",
            modelBase: "SD 1.5",
            modelDescription: "Generally used for realistic people/scenes.",
            modelRecommends:
              "Sampler(s): DPM++ SDE, DPM++ 2M, DPM++ 2M SDE\nScheduler(s): Karras\nSteps: 20-30\n CFG Scale: 5\nNegative: cartoon, painting, illustration, (worst quality, low quality, normal quality:2)",
            modelLink: "https://civitai.com/models/25694",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323452678122115092/02499-144278541.png?ex=677490db&is=67733f5b&hm=8668dba48c3fe29cfd250e729bdbc5efd23278a00277eb9290b2f6f38d19ab71&",
          },
          {
            modelName: "Juggernaut",
            modelCommandName: "juggernaut_reborn",
            modelBase: "SD 1.5",
            modelDescription: "Generally used for realistic people/scenes.",
            modelRecommends:
              "Sampler(s): DPM++ 2M\nScheduler(s): Karras\nSteps: 35\nCFG Scale: 7",
            modelLink: "https://civitai.com/models/46422",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323452584387805284/00110-masterpiecebest20qualityhigh20detialrealistic20Industrial20age20city20deep20canyons20in20the20middle20architectural20s.png?ex=677490c4&is=67733f44&hm=9ced216223fcc211cdd439a2e0e0a606e229aca57f8dba891f496130acaf0e47&",
          },
          {
            modelName: "Juggernaut XL",
            modelCommandName: "Juggernaut_X_RunDiffusion_Hyper",
            modelBase: "SD XL",
            modelDescription: "Generally used for realistic people/scenes",
            modelRecommends:
              "Sampler(s): DPM++ 2M, DPM++ SDE\nScheduler(s): Karras\nSteps: 4-6\nCFG Scale: 1-2",
            modelLink: "https://civitai.com/models/133005",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323452471288270868/00006-1818826116.png?ex=677490a9&is=67733f29&hm=089ab3b3eb1800d2bc8f865a20abadda967890d74598faf2d171dbf164373d3b&",
          },
          {
            modelName: "MeinaMix",
            modelCommandName: "meinamix_meinaV11",
            modelBase: "SD 1.5",
            modelDescription: "Generally used for anime, mix of styles.",
            modelRecommends:
              "Sampler(s): DPM++ SDE, DPM++ 2M, Euler a\nScheduler(s): Karras\nSteps: 20-60\nCFG Scale: 4-11\nClip Skip: 2\nNegative: (worst quality, low quality:1.4), (zombie, sketch, interlocked fingers, comic)",
            modelLink: "https://civitai.com/models/7240",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323452354561048657/00001.png?ex=6774908d&is=67733f0d&hm=a1c6bcb0bf38fc45307e7bb04845fdf6a8c8b9f2b182d318374d6bd453824f25&",
          },
          {
            modelName: "Perfect World",
            modelCommandName: "perfectWorld_v6Baked",
            modelBase: "SD 1.5",
            modelDescription:
              "Generally used for a middle ground between realism and anime.",
            modelRecommends:
              "Sampler(s): DPM++ 2M\nScheduler(s): Karras\nSteps: 20-40\nCFG Scale: 5-10",
            modelLink: "https://civitai.com/models/8281",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323452232653344799/SILVER.png?ex=67749070&is=67733ef0&hm=db862a63016e068434f9e7bb087fe519df702cf5fb59923df6f61dea04b924b5&",
          },
          {
            modelName: "Realistic Vision",
            modelCommandName: "realisticVisionV60B1_v51HyperVAE",
            modelBase: "SD 1.5",
            modelDescription: "Generally used for realistic faces",
            modelRecommends:
              "Sampler(s): DPM++ SDE, Euler a\nScheduler(s): Karras\nSteps: 4-10\nCFG Scale: 2-7\nClip Skip: 1-2\nNegative: (deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime, mutated hands and fingers:1.4), (deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation, UnrealisticDream",
            modelLink: "https://civitai.com/models/4201",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323451989769850932/00012-3277121308.png?ex=67749036&is=67733eb6&hm=5f430ec81564a735f67bd66e06dc3b0fd47d410941de637133919cc16d2c0dcd&",
          },
          {
            modelName: "ReV Animated",
            modelCommandName: "revAnimated_v2Rebirth",
            modelBase: "SD 1.5",
            modelDescription:
              "Generally used for anime, fantasy, and semi-realistic.",
            modelRecommends:
              "Sampler(s): DPM++ 2M, Euler a\nScheduler(s): Karras\nSteps: 20-30\nNegative: easynegative, By bad artist -neg, ng_deepnegative_v1_75t,  verybadimagenegative_v1.3, (worst quality, low quality:1.4)",
            modelLink: "https://civitai.com/models/7371",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323451854578778203/00002-839691141.png?ex=67749016&is=67733e96&hm=e0128af09df74200ba4879ff733f3e983ea914b7f667f5e36dc467e70d51cfc3&",
          },
          {
            modelName: "SD XL",
            modelCommandName: "sdXL_v10VAEFix",
            modelBase: "SD XL",
            modelDescription: "General purpose model, basic XL model for SD.",
            modelRecommends: "Any",
            modelLink: "https://civitai.com/models/101055",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323451698391289927/ComfyUI_00352_.png?ex=67748ff1&is=67733e71&hm=de54e808a42012b26bdc88bfe9652650e3d5958ce98cce726c76cb2d82947922&",
          },
          {
            modelName: "SD 1.5",
            modelCommandName: "v1-5-pruned-emaonly",
            modelBase: "SD 1.5",
            modelDescription: "General purpose model, basic model for SD.",
            modelRecommends: "Any",
            modelLink: "https://civitai.com/models/62437",
            modelImage:
              "https://cdn.discordapp.com/attachments/1323450875363987528/1323451332610228245/00043-v1-5-pruned-emaonly20-202024-02-0220-2023-34-3520_20904699.png?ex=67748f9a&is=67733e1a&hm=1a55bd2d83b5dcacb52b7e587003f76ae6d6b27b91a66d9638be7e8d867429c4&",
          },
        ];
        let modelMatch = {};
        modelArray.forEach((model) => {
          if (selectedValue == model.modelName) {
            modelMatch = model;
          }
        });

        // Rebuild model row with placeholder
        const modelRow = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder(
            interaction.component.toJSON()
          ).setPlaceholder(selectedValue)
        );
        // Build model info embed
        const modelInfoEmbed = new EmbedBuilder()
          .setColor(0x9e41ff)
          .setTitle("SD Info")
          .setAuthor({ name: `${botNickname}`, iconURL: botPFP })
          .addFields(
            { name: "Info Type", value: `${firstSelectValue}` },
            { name: "Model", value: `${selectedValue}` },
            { name: "Name in /gen", value: `${modelMatch.modelCommandName}` },
            { name: "Base Model", value: `${modelMatch.modelBase}` },
            { name: "Description", value: `${modelMatch.modelDescription}` },
            {
              name: "Recommended /gen Options",
              value: `${modelMatch.modelRecommends}`,
            },
            { name: "Civitai Link", value: `${modelMatch.modelLink}` }
          )
          .setImage(modelMatch.modelImage)
          .setTimestamp()
          .setFooter({ text: `${nickname}`, iconURL: userPFP });

        await interaction.update({
          content: " ",
          embeds: [modelInfoEmbed],
          components: [interaction.message.components[0], modelRow],
        });
        //console.log(modelInfoEmbed.toJSON());

      } else if (firstSelectValue === "Loras") {
        // Build lora select menus, but check model to avoid building both
        if (sd15Array.includes(selectedValue)) {
          // Build 1.5 lora select menu
          const loraSelect15 = new StringSelectMenuBuilder()
            .setCustomId("loras15")
            .setPlaceholder("Select lora")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("Detail Tweaker LoRA")
                .setDescription("add_detail")
                .setValue("Detail Tweaker LoRA"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Anime Screencap Style LoRA")
                .setDescription("animemix_v3_offset")
                .setValue("Anime Screencap Style LoRA"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Anime Tarot Card Art Style LoRA")
                .setDescription("animetarotV51")
                .setValue("Anime Tarot Card Art Style LoRA"),
              new StringSelectMenuOptionBuilder()
                .setLabel("D&D Fantasy Painting Styles")
                .setDescription("Fantasy_Book_Style")
                .setValue("D&D Fantasy Painting Styles"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Studio Ghibli Style LoRA")
                .setDescription("ghibli_style_offset")
                .setValue("Studio Ghibli Style LoRA"),
              new StringSelectMenuOptionBuilder()
                .setLabel("GHIBLI_Background")
                .setDescription(
                  "Pyramid lora_Ghibli_n3_0.7+Pyramid lora_Ghibli_v2_0.3"
                )
                .setValue("GHIBLI_Background"),
              new StringSelectMenuOptionBuilder()
                .setLabel("LeLo - LEGO LoRA for SD1.5")
                .setDescription("lego_v2.0.768")
                .setValue("LeLo - LEGO LoRA for SD1.5"),
              new StringSelectMenuOptionBuilder()
                .setLabel("M_Pixel")
                .setDescription("pixel_f2")
                .setValue("M_Pixel"),
              new StringSelectMenuOptionBuilder()
                .setLabel("SamDoesArts (Sam Yang) Style LoRA")
                .setDescription("sam_yang_offset_right_filesize")
                .setValue("SamDoesArts (Sam Yang) Style LoRA"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Urban Samurai")
                .setDescription("urbansamuraiv3testing")
                .setValue("Urban Samurai")
            );

          // Build lora row
          const lora15Row = new ActionRowBuilder().addComponents(loraSelect15);

          // Build prevRow
          const modelRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder(
              interaction.component.toJSON()
            ).setPlaceholder(selectedValue)
          );

          // Build next embed
          const loraEmbed = new EmbedBuilder()
            .setColor(0x9e41ff)
            .setTitle("SD Info")
            .setAuthor({ name: `${botNickname}`, iconURL: botPFP })
            .addFields(
              { name: "Info Type", value: `${firstSelectValue}` },
              { name: "Model", value: `${selectedValue}` },
              { name: "Lora", value: `Select Below` }
            )
            .setTimestamp()
            .setFooter({ text: `${nickname}`, iconURL: userPFP });

          await interaction.update({
            content: " ",
            embeds: [loraEmbed],
            components: [
              interaction.message.components[0],
              modelRow,
              lora15Row,
            ],
          });
        } else if (sdxlArray.includes(selectedValue)) {
          // Build XL lora select menu
          const loraSelectXL = new StringSelectMenuBuilder()
            .setCustomId("lorasXL")
            .setPlaceholder("Select lora")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("Detail Tweaker XL")
                .setDescription("add-detail-xl")
                .setValue("Detail Tweaker XL"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Aesthetic Anime LoRA")
                .setDescription("aesthetic_anime_v1s")
                .setValue("Aesthetic Anime LoRA"),
              new StringSelectMenuOptionBuilder()
                .setLabel("DetailedEyes_XL")
                .setDescription("DetailedEyes_V3")
                .setValue("DetailedEyes_XL"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Dungeons & Dragons")
                .setDescription("dungeons_and_dragons_xl_v3")
                .setValue("Dungeons & Dragons"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Fractal Art")
                .setDescription("fractal-art.v1")
                .setValue("Fractal Art"),
              new StringSelectMenuOptionBuilder()
                .setLabel("LeLo - LEGO LoRA for XL")
                .setDescription("Lego_XL_v2.1")
                .setValue("LeLo - LEGO LoRA for XL"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Logo.Redmond")
                .setDescription("LogoRedmondV2-Logo-LogoRedmAF")
                .setValue("Logo.Redmond"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Pixel Art XL")
                .setDescription("pixelbuildings128-v2")
                .setValue("Pixel Art XL"),
              new StringSelectMenuOptionBuilder()
                .setLabel("All Disney Princess XL LoRA")
                .setDescription("princess_xl_v2")
                .setValue("All Disney Princess XL LoRA"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Sinfully Stylish")
                .setDescription("sinfully_stylish_SDKL")
                .setValue("Sinfully Stylish"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Tech-Streetwear")
                .setDescription("tech_streetwear")
                .setValue("Tech-Streetwear"),
              new StringSelectMenuOptionBuilder()
                .setLabel("More Art")
                .setDescription("xl_more_art-full_v1")
                .setValue("More Art")
            );

          // Build lora row
          const loraXLRow = new ActionRowBuilder().addComponents(loraSelectXL);

          // Build prevRow
          const modelRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder(
              interaction.component.toJSON()
            ).setPlaceholder(selectedValue)
          );

          // Build next embed
          const loraEmbed = new EmbedBuilder()
            .setColor(0x9e41ff)
            .setTitle("SD Info")
            .setAuthor({ name: `${botNickname}`, iconURL: botPFP })
            .addFields(
              { name: "Info Type", value: `${firstSelectValue}` },
              { name: "Model", value: `${selectedValue}` },
              { name: "Lora", value: `Select Below` }
            )
            .setTimestamp()
            .setFooter({ text: `${nickname}`, iconURL: userPFP });

          await interaction.update({
            content: " ",
            embeds: [loraEmbed],
            components: [
              interaction.message.components[0],
              modelRow,
              loraXLRow,
            ],
          });
        }
      } else if (firstSelectValue === "Embeddings") {
        // Build embedding select menus, but check model to avoid building both
        if (sd15Array.includes(selectedValue)) {
          // Build 1.5 embedding select menu
          const embeddingSelect15 = new StringSelectMenuBuilder()
            .setCustomId("embeddings15")
            .setPlaceholder("Select embedding")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("BadDream")
                .setDescription("BadDream")
                .setValue("BadDream"),
              new StringSelectMenuOptionBuilder()
                .setLabel("UnrealisticDream")
                .setDescription("UnrealisticDream")
                .setValue("UnrealisticDream"),
              new StringSelectMenuOptionBuilder()
                .setLabel("badhandv4")
                .setDescription("badhandv4")
                .setValue("badhandv4"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Bad artist Negative")
                .setDescription("By bad artist -neg")
                .setValue("Bad artist Negative"),
              new StringSelectMenuOptionBuilder()
                .setLabel("EasyNegative")
                .setDescription("easynegative")
                .setValue("EasyNegative"),
              new StringSelectMenuOptionBuilder()
                .setLabel("FastNegativeV2")
                .setDescription("FastNegativeV2")
                .setValue("FastNegativeV2"),
              new StringSelectMenuOptionBuilder()
                .setLabel("negative_hand Negative")
                .setDescription("negative_hand-neg")
                .setValue("negative_hand Negative"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Deep Negative V1.x")
                .setDescription("ng_deepnegative_v1_75t")
                .setValue("Deep Negative V1.x"),
              new StringSelectMenuOptionBuilder()
                .setLabel("veryBadImageNegative")
                .setDescription("verybadimagenegative_v1.3")
                .setValue("veryBadImageNegative")
            );

          // Build embed 1.5 row
          const embedding15Row = new ActionRowBuilder().addComponents(
            embeddingSelect15
          );

          // Build prevRow
          const modelRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder(
              interaction.component.toJSON()
            ).setPlaceholder(selectedValue)
          );

          // Build next embed
          const embedEmbed = new EmbedBuilder()
            .setColor(0x9e41ff)
            .setTitle("SD Info")
            .setAuthor({ name: `${botNickname}`, iconURL: botPFP })
            .addFields(
              { name: "Info Type", value: `${firstSelectValue}` },
              { name: "Model", value: `${selectedValue}` },
              { name: "Embedding", value: `Select Below` }
            )
            .setTimestamp()
            .setFooter({ text: `${nickname}`, iconURL: userPFP });

          await interaction.update({
            content: " ",
            embeds: [embedEmbed],
            components: [
              interaction.message.components[0],
              modelRow,
              embedding15Row,
            ],
          });
        } else if (sdxlArray.includes(selectedValue)) {
          // Build XL embedding select menu
          const embeddingSelectXL = new StringSelectMenuBuilder()
            .setCustomId("embeddingsXL")
            .setPlaceholder("Select embedding")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("General Negative 1")
                .setDescription("ac_neg1")
                .setValue("General Negative 1"),
              new StringSelectMenuOptionBuilder()
                .setLabel("General Negative 2")
                .setDescription("ac_neg2")
                .setValue("General Negative 2"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Deep Negative XL")
                .setDescription("DeepNegative_xl_v1")
                .setValue("Deep Negative XL"),
              new StringSelectMenuOptionBuilder()
                .setLabel("FastNegative")
                .setDescription("FastNegative")
                .setValue("FastNegative"),
              new StringSelectMenuOptionBuilder()
                .setLabel("3D Embed")
                .setDescription("SK_3DRENDER")
                .setValue("3D Embed"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Analog Film")
                .setDescription("SK_ANALOGFILM")
                .setValue("Analog Film"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Anime Embed")
                .setDescription("SK_ANIME")
                .setValue("Anime Embed"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Cinematic Embed")
                .setDescription("SK_CINEMATIC")
                .setValue("Cinematic Embed"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Comic Embed")
                .setDescription("SK_COMIC")
                .setValue("Comic Embed"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Cyberpunk Embed")
                .setDescription("SK_Cyberpunk")
                .setValue("Cyberpunk Embed"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Digital Art")
                .setDescription("SK_DIGITALART")
                .setValue("Digital Art"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Fantasy Embed")
                .setDescription("SK_Fantasy")
                .setValue("Fantasy Embed"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Studio Ghibli")
                .setDescription("SK_Ghibli")
                .setValue("Studio Ghibli"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Vector Art")
                .setDescription("SK_VECTORART")
                .setValue("Vector Art"),
              new StringSelectMenuOptionBuilder()
                .setLabel("unaestheticXL")
                .setDescription("unaestheticXL2v10")
                .setValue("unaestheticXL"),
              new StringSelectMenuOptionBuilder()
                .setLabel("ZIP2D Quality")
                .setDescription("ZIP2D")
                .setValue("ZIP2D Quality"),
              new StringSelectMenuOptionBuilder()
                .setLabel("ZIP2D Negative")
                .setDescription("zip2d_neg")
                .setValue("ZIP2D Negative"),
              new StringSelectMenuOptionBuilder()
                .setLabel("ZIP Realism")
                .setDescription("ziprealism")
                .setValue("ZIP Realism"),
              new StringSelectMenuOptionBuilder()
                .setLabel("ZIP Realism Negative")
                .setDescription("ziprealism_neg")
                .setValue("ZIP Realism Negative")
            );

          // Build embed xl row
          const embeddingXLRow = new ActionRowBuilder().addComponents(
            embeddingSelectXL
          );

          // Build prevRow
          const modelRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder(
              interaction.component.toJSON()
            ).setPlaceholder(selectedValue)
          );

          // Build next embed
          const embedEmbed = new EmbedBuilder()
            .setColor(0x9e41ff)
            .setTitle("SD Info")
            .setAuthor({ name: `${botNickname}`, iconURL: botPFP })
            .addFields(
              { name: "Info Type", value: `${firstSelectValue}` },
              { name: "Model", value: `${selectedValue}` },
              { name: "Embedding", value: `Select Below` }
            )
            .setTimestamp()
            .setFooter({ text: `${nickname}`, iconURL: userPFP });

          await interaction.update({
            content: " ",
            embeds: [embedEmbed],
            components: [
              interaction.message.components[0],
              modelRow,
              embeddingXLRow,
            ],
          });
        }
      }
    } else if (
      interaction.customId === "loras15" ||
      interaction.customId === "lorasXL"
    ) {
      // Get interacted menu value
      selectedValue = interaction.values[0];
      const firstSelectValue = fields.find(
        (field) => field.name === "Info Type"
      ).value;
      const secondSelectValue = fields.find(
        (field) => field.name === "Model"
      ).value;

      // Build lora constants
      const loraArray = [
        {
          loraName: "Detail Tweaker LoRA",
          loraModelType: "SD 1.5",
          loraUsage: "<lora:add_detail:(weight)>",
          loraWeight: "(More detail) 2.0 to -2.0 (Less detail)",
          loraDescription:
            "Enhancing/diminishing detail while keeping the overall style/character",
          loraRecommends: "None",
          loraLink: "https://civitai.com/models/58390",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323456274460839998/20221021193766-3422616374-masterpiece20best20quality20highres201girl20school20uniform20_lora_add_detail_1_20kangel20_lora_kangelNeedyGirl_v10_1_.png?ex=67749434&is=677342b4&hm=48068eb372d9d234ced220d5ec40013c7bb1a83152b814446a4c64cf4ffb784e&",
        },
        {
          loraName: "Anime Screencap Style LoRA",
          loraModelType: "SD 1.5",
          loraUsage: "<lora:animemix_v3_offset:(weight)>",
          loraWeight: "(More anime style) 1.0 to 0.0 (No anime style)",
          loraDescription: "Create anime TV style",
          loraRecommends: "None",
          loraLink: "https://civitai.com/models/4982",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323456408762454150/3978521851-2471939750-anime20screencap201990s__style_201boy20collarbone20looking20at20viewer20male20focus20open20mouth20orange20eyes20orange20hair20solo20s_ed.png?ex=67749454&is=677342d4&hm=cc9565213958aee3c45e55573dc6b14a1fcc5513ca5499bb9c0d16d281050b9d&",
        },
        {
          loraName: "Anime Tarot Card Art Style LoRA",
          loraModelType: "SD 1.5",
          loraUsage: "<lora:animetarotV51:(weight)>",
          loraWeight:
            "(More tarot card style) 1.0 to 0.0 (No tarot card style)",
          loraDescription:
            "Create anime tarot cards, but can produce non-anime related tarot cards",
          loraRecommends: "None",
          loraLink: "https://civitai.com/models/11177",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323456516505735262/00149-717435807.png?ex=6774946e&is=677342ee&hm=7e8821269480f53f65419c85127da4c2935aaf381516c6c96c8c8de6ed34d6d9&",
        },
        {
          loraName: "D&D Fantasy Painting Styles",
          loraModelType: "SD 1.5",
          loraUsage: "<lora:Fantasy_Book_Style:(weight)>",
          loraWeight:
            "(More fantasy book style) 1.0 to 0.0 (No fantasy book style)",
          loraDescription: "Create a fantasy book illustration style",
          loraRecommends:
            "Add to prompt: FantasyBookCover Style, fantasy painting, fantasy",
          loraLink: "https://civitai.com/models/243531",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323456650979315752/00000-1244861449.png?ex=6774948e&is=6773430e&hm=8c3200db352507a5e0f6a69dddc5a45b19864318a074d743101de813f5474b82&",
        },
        {
          loraName: "Studio Ghibli Style LoRA",
          loraModelType: "SD 1.5",
          loraUsage: "<lora:ghibli_style_offset:(weight)>",
          loraWeight:
            "(More studio ghibli style) 1.5 to 0.0 (No studio ghibli style)",
          loraDescription: "Create Studio Ghibli style for characters",
          loraRecommends: "Add to prompt: ghibli style",
          loraLink: "https://civitai.com/models/6526",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323456797201141821/3978513807-1178811602-ghibli20style20san20_mononoke20hime__1girl20armlet20bangs20black20hair20black20undershirt20breasts20cape20circlet20earrings20facep.png?ex=677494b1&is=67734331&hm=bdc4eee5d4be2e1350fec1ce797750b44f2f80c555bab1efe128e4666a87f416&",
        },
        {
          loraName: "GHIBLI_Background",
          loraModelType: "SD 1.5",
          loraUsage:
            "<lora:Pyramid lora_Ghibli_n3_0.7+Pyramid lora_Ghibli_v2_0.3:(weight)>",
          loraWeight:
            "(More studio ghibli style) 1.5 to 0.0 (No studio ghibli style)",
          loraDescription: "Create Studio Ghibli style for environments",
          loraRecommends: "None",
          loraLink: "https://civitai.com/models/54233",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323456887068557343/workspace_images_605549513536505493_97f987a6eee96aa39cb696a2ca52b2b9.png?ex=677494c6&is=67734346&hm=cbfd69dd538bc0adcfe23db012b806e9d1cafe23c2744415b281b000f64bd3ea&",
        },
        {
          loraName: "LeLo - LEGO LoRA for SD1.5",
          loraModelType: "SD 1.5",
          loraUsage: "<lora:lego_v2.0.768:(weight)>",
          loraWeight: "(More lego style) 2.0 to 0.0 (No lego style)",
          loraDescription: "Create lego style",
          loraRecommends:
            "Add to prompt: LEGO BrickHeadz, LEGO MiniFig, LEGO Creator",
          loraLink: "https://civitai.com/models/92444",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323456986192543805/v2.png?ex=677494de&is=6773435e&hm=2bda0998bd0f74e231e8bce10dfb8d01e92bb028786efeee190078671e9c6069&",
        },
        {
          loraName: "M_Pixel",
          loraModelType: "SD 1.5",
          loraUsage: "<lora:pixel_f2:(weight)>",
          loraWeight: "(More pixel style) 1.0 to 0.0 (No pixel style)",
          loraDescription: "Create pixel style",
          loraRecommends: "Add to prompt: pixel",
          loraLink: "https://civitai.com/models/44960",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323457078878142515/00069.png?ex=677494f4&is=67734374&hm=921e61b4df5baa684f7d550c68b1134071b27fb0907d7ccb507f57cf88fa0ac3&",
        },
        {
          loraName: "SamDoesArts (Sam Yang) Style LoRA",
          loraModelType: "SD 1.5",
          loraUsage: "<lora:sam_yang_offset_right_filesize:(weight)>",
          loraWeight:
            "(More SamDoesArt style) 1.0 to 0.0 (No SamDoesArt style)",
          loraDescription: "Create SamDoesArt style",
          loraRecommends: "Add to prompt: sam yang",
          loraLink: "https://civitai.com/models/6638",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323457163649220628/3978522735-691460967-sam20yang201girl20backlighting20bare20shoulders20black20choker20blurry20blurry20background20blush20breasts20choker20cleavage20closed.png?ex=67749508&is=67734388&hm=039b4ea14e70398f89530b94a0fa6682f28f05476c45e62cee22de68a56716be&",
        },
        {
          loraName: "Urban Samurai",
          loraModelType: "SD 1.5",
          loraUsage: "<lora:urbansamuraiv3testing:(weight)>",
          loraWeight:
            "(More urban samurai style) 1.0 to 0.0 (No urban samurai style)",
          loraDescription: "Create urban techwear style",
          loraRecommends:
            "Add to prompt: techwear jacket, black gloves, tactical vest, with buckle and tape",
          loraLink: "https://civitai.com/models/23337",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323457255693094932/01084-20230426070624-3728671225-DDIM-50-12.png?ex=6774951e&is=6773439e&hm=df80903c28bd0817c8033c259febaacbabdd86f34e399a749d8d527ca91c998c&",
        },
        {
          loraName: "Detail Tweaker XL",
          loraModelType: "SD XL",
          loraUsage: "<lora:add-detail-xl:(weight)>",
          loraWeight: "(More detail) 3.0 to -3.0 (Less detail)",
          loraDescription:
            "Enhancing/diminishing detail while keeping the overall style/character",
          loraRecommends: "None",
          loraLink: "https://civitai.com/images/1917130",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323457343219957762/xyz_grid-0005-3308533307.png?ex=67749533&is=677343b3&hm=2d93bc9b0c8ede2e6b65f21178061dbca394c144852c1c6262b63de6ff452c34&",
        },
        {
          loraName: "Aesthetic Anime LoRA",
          loraModelType: "SD XL",
          loraUsage: "<lora:aesthetic_anime_v1s:(weight)>",
          loraWeight: "(More aesthetic) 1.5 to -1.5 (Less aesthetic)",
          loraDescription: "Create more aesthetic",
          loraRecommends: "None",
          loraLink: "https://civitai.com/images/6328486",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323457480751317033/image_2024-02-06_14-28-29.png?ex=67749554&is=677343d4&hm=c3f0337da50d8aae9dad0e0ebecec22bdcedbaa81fba3f75ae8a95dff3e370f3&",
        },
        {
          loraName: "DetailedEyes_XL",
          loraModelType: "SD XL",
          loraUsage: "<lora:DetailedEyes_V3:(weight)>",
          loraWeight: "(More detailed eyes) 1.5 to -1.5 (Less detailed eyes)",
          loraDescription: "Create more detailed eyes",
          loraRecommends: "None",
          loraLink: "https://civitai.com/models/120723",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323457574082707567/prompt_matrix-0034-1540158344.png?ex=6774956a&is=677343ea&hm=63fccc922ccf970a94bd15229fac45e58562805cca21321323ba9a253e2b7e3c&",
        },
        {
          loraName: "Dungeons & Dragons",
          loraModelType: "SD XL",
          loraUsage: "<lora:dungeons_and_dragons_xl_v3:(weight)>",
          loraWeight: "(More D&D style) 1.0 to -1.0 (Less D&D style)",
          loraDescription: "Create D&D art",
          loraRecommends: "Add to prompt: dungeons and dragons",
          loraLink: "https://civitai.com/models/134343",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323457659218956378/25431C903FF0158F9B62D34176CA27F103ECA8E2A834F9F39D044314234882DE.png?ex=6774957e&is=677343fe&hm=205a8ee58db9000e83855b1cd8ad0b01215b709c5126148163b200eecee2c84b&",
        },
        {
          loraName: "Fractal Art",
          loraModelType: "SD XL",
          loraUsage: "<lora:fractal-art.v1:(weight)>",
          loraWeight: "(More fractal art) 1.5 to -1.5 (Less fractal art)",
          loraDescription: "Creat fractal art",
          loraRecommends: "None",
          loraLink: "https://civitai.com/models/124347",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323457743239254037/00156-1513278802.png?ex=67749592&is=67734412&hm=9734fa24921e95dd74656dcddcbca0c3bb881d1173e049803f4be55c2bcd8c5e&",
        },
        {
          loraName: "LeLo - LEGO LoRA for XL",
          loraModelType: "SD XL",
          loraUsage: "<lora:Lego_XL_v2.1:(weight)>",
          loraWeight: "(More lego style) 2.0 to 0.0 (No lego style)",
          loraDescription: "Create lego style",
          loraRecommends:
            "Add to prompt: LEGO MiniFig, LEGO Creator, LEGO BrickHeadz",
          loraLink: "https://civitai.com/models/92444",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323457829444522024/cover.png?ex=677495a7&is=67734427&hm=e7ffebcea25a4676fdfd8232a015782e967b7b4e35aa00307a6e7992076a0e6c&",
        },
        {
          loraName: "Logo.Redmond",
          loraModelType: "SD XL",
          loraUsage: "<lora:LogoRedmondV2-Logo-LogoRedmAF:(weight)>",
          loraWeight: "(More logo style) 2.0 to 0.0 (No logo style)",
          loraDescription: "Create a logo",
          loraRecommends: "Add to prompt: logo, logoredmaf",
          loraLink: "https://civitai.com/models/124609",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323457911737024512/00147-603851934.png?ex=677495ba&is=6773443a&hm=5bc34a5da4ca90198f32266226475f679a92a158d23d5edf7d8e81418b59b66e&",
        },
        {
          loraName: "Pixel Art XL",
          loraModelType: "SD XL",
          loraUsage: "<lora:pixelbuildings128-v2:(weight)>",
          loraWeight: "(More pixel style) 1.0 to 0.0 (No pixel style)",
          loraDescription: "Create pixel style",
          loraRecommends: "None",
          loraLink: "https://civitai.com/models/120096",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323458063692337312/Image_00048_.png?ex=677495df&is=6773445f&hm=d7f52e421564931ae2e1be7beff17b54118f26e75a5e70c329585d3a61c75472&",
        },
        {
          loraName: "All Disney Princess XL LoRA",
          loraModelType: "SD XL",
          loraUsage: "<lora:princess_xl_v2:(weight)>",
          loraWeight: "(For close ups) 1.0 to 0.5, 0.5 to 0.3 (For full body)",
          loraDescription:
            "Create disney princesses by directly prompting their names, such as Anna, Ariel, Aurora, Belle, Cinderella, Elsa, Asha, Jasmine, Merida, Moana, Mulan, Namaari, Pocahontas, Rapunzel, Raya, Shank, Snow White, Tiana, Vanellope, Alice, Chel,Esmerada, Jane Porter, Kida, Megera, Mirabel Madrigal, Isabela Madrigal, Dolores Madrigal",
          loraRecommends:
            "Add specific name of character to prompt (check description)",
          loraLink: "https://civitai.com/models/212532",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323458162661134477/00367-3249567322.png?ex=677495f6&is=67734476&hm=9762f88a5362d3ab3eeadd4684f28a0bca7338ece1ac5d125b357aa367574e80&",
        },
        {
          loraName: "Sinfully Stylish",
          loraModelType: "SD XL",
          loraUsage: "<lora:sinfully_stylish_SDKL:(weight)>",
          loraWeight:
            "(More dramatic lighting) 1.0 to 0.0 (No dramatic lighting)",
          loraDescription: "Dramatic lighting for realistic and anime",
          loraRecommends: "None",
          loraLink: "https://civitai.com/models/340248",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323458256709877812/FB7DF3503EBE0EC399C1D89A8156E2B65D36D7D6666440DA2D7D0B7ECAD2AA84.png?ex=6774960d&is=6773448d&hm=358c71b1cc2304998056b8a19479b9351120df59a3cf9e684e7bb174c1bc5984&",
        },
        {
          loraName: "Tech-Streetwear",
          loraModelType: "SD XL",
          loraUsage: "<lora:tech_streetwear:(weight)>",
          loraWeight: "(More techwear style) 1.0 to 0.0 (No techwear style)",
          loraDescription: "Create tech wear",
          loraRecommends: "None",
          loraLink: "https://civitai.com/models/149408",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323458339744514048/ComfyUI_00141_.png?ex=67749620&is=677344a0&hm=29118545c1cc1a6d72dafd4c5b367505854cce52e33a67a86c9a39400bb2cc1b&",
        },
        {
          loraName: "More Art",
          loraModelType: "SD XL",
          loraUsage: "<lora:xl_more_art-full_v1:(weight)>",
          loraWeight: "(More art) 1.5 to -1.5 (Less art)",
          loraDescription: "Add more art",
          loraRecommends: "None",
          loraLink: "https://civitai.com/models/124347",
          loraImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323458424582705173/crystal_structure.png?ex=67749635&is=677344b5&hm=1f9504e69a76f6244f717e102449ea7e1421228b40da1a2d9b6938e9d92882a0&",
        },
      ];
      let loraMatch = {};
      loraArray.forEach((lora) => {
        if (selectedValue == lora.loraName) {
          loraMatch = lora;
        }
      });

      // Rebuild lora row with placeholder
      const loraRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder(
          interaction.component.toJSON()
        ).setPlaceholder(selectedValue)
      );
      // Build model info embed
      const loraInfoEmbed = new EmbedBuilder()
        .setColor(0x9e41ff)
        .setTitle("SD Info")
        .setAuthor({ name: `${botNickname}`, iconURL: botPFP })
        .addFields(
          { name: "Info Type", value: `${firstSelectValue}` },
          { name: "Model", value: `${secondSelectValue}` },
          { name: "Lora", value: `${selectedValue}` },
          { name: "Compatible Base", value: `${loraMatch.loraModelType}` },
          {
            name: "Usage (typically placed in prompt)",
            value: `${loraMatch.loraUsage}`,
          },
          { name: "Weights", value: `${loraMatch.loraWeight}` },
          { name: "Description", value: `${loraMatch.loraDescription}` },
          { name: "Recomendations", value: `${loraMatch.loraRecommends}` },
          { name: "Civitai Link", value: `${loraMatch.loraLink}` }
        )
        .setImage(loraMatch.loraImage)
        .setTimestamp()
        .setFooter({ text: `${nickname}`, iconURL: userPFP });

      await interaction.update({
        content: " ",
        embeds: [loraInfoEmbed],
        components: [
          interaction.message.components[0],
          interaction.message.components[1],
          loraRow,
        ],
      });
    } else if (
      interaction.customId === "embeddings15" ||
      interaction.customId === "embeddingsXL"
    ) {
      // Get interacted menu value
      selectedValue = interaction.values[0];
      const firstSelectValue = fields.find(
        (field) => field.name === "Info Type"
      ).value;
      const secondSelectValue = fields.find(
        (field) => field.name === "Model"
      ).value;

      // Build embedding constants
      const embeddingArray = [
        {
          embeddingName: "BadDream",
          embeddingModelType: "SD 1.5",
          embeddingUsage: "BadDream",
          embeddingDescription: "Negative prompt embedding, for DreamShaper",
          embeddingRecommends:
            "Use in combination with UnrealisticDream and FastNegativeV2",
          embeddingLink: "https://civitai.com/models/72437",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323458995545051207/xyz_grid-0143-132340231-8k20portrait20of20beautiful20cyborg20with20brown20hair20intricate20elegant20highly20detailed20majestic20digital20photography20art20by20artg.png?ex=677496bd&is=6773453d&hm=0d5fae618c9ec14ffaf328ed72ca2b23ef47662dac3c6b064c57317cd137bf02&",
        },
        {
          embeddingName: "badhandv4",
          embeddingModelType: "SD 1.5",
          embeddingUsage: "badhandv4",
          embeddingDescription:
            "Negative prompt embedding, helps produce better hands",
          embeddingRecommends: "None",
          embeddingLink: "https://civitai.com/models/16993",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323459078785073183/212048.png?ex=677496d1&is=67734551&hm=ff3f7a9f60973d50aa8de28ec0dabd5c1370bcf3b26a57bb1c80488529bbd880&",
        },
        {
          embeddingName: "Bad artist Negative",
          embeddingModelType: "SD 1.5",
          embeddingUsage: "bad-artist / bad-artist-anime",
          embeddingDescription:
            "Negative prompt embedding, produces higher quality art",
          embeddingRecommends:
            'Recommended to use with "by", ex. "sketch by bad-artist", or "sketch by bad-artist-anime"',
          embeddingLink: "https://civitai.com/models/5224",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323459162490798171/1670737110801-630e54c81ef92d4e37a331b8.png?ex=677496e5&is=67734565&hm=85235fd112e68df818436012a4f34600884c6544a4a06aa490bad8895c7f6a5a&",
        },
        {
          embeddingName: "EasyNegative",
          embeddingModelType: "SD 1.5",
          embeddingUsage: "easynegative",
          embeddingDescription:
            "Negative prompt embedding, generic negative keywords",
          embeddingRecommends: "None",
          embeddingLink: "https://civitai.com/models/7808",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323459250994811011/sample02.png?ex=677496fa&is=6773457a&hm=92dd9cbbee370a186a354b92e9baab59c66053f7934b712b87624feecf23e4aa&",
        },
        {
          embeddingName: "FastNegativeV2",
          embeddingModelType: "SD 1.5",
          embeddingUsage: "FastNegativeV2",
          embeddingDescription:
            "Negative prompt embedding, generic negative keywords",
          embeddingRecommends: "None",
          embeddingLink: "https://civitai.com/models/71961",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323459342980223097/tmp2jwfz703.png?ex=67749710&is=67734590&hm=cc61b389e685b65c1a237904b7a7cfddbae94c65a6e10675f679b222e02bfe3e&",
        },
        {
          embeddingName: "negative_hand Negative",
          embeddingModelType: "SD 1.5",
          embeddingUsage: "negative_hand",
          embeddingDescription:
            "Negative prompt embedding, helps produce better hands",
          embeddingRecommends: "None",
          embeddingLink: "https://civitai.com/images/667878",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323459444058624041/Aurora_preview.png?ex=67749728&is=677345a8&hm=adce1344d2b9d3e0c5d46ca58b64238a9b95b0c4ec80a7b8a72067630fc13c93&",
        },
        {
          embeddingName: "Deep Negative V1.x",
          embeddingModelType: "SD 1.5",
          embeddingUsage: "ng_deepnegative_v1_75t",
          embeddingDescription:
            "Negative prompt embedding, generic negative keywords",
          embeddingRecommends: "None",
          embeddingLink: "https://civitai.com/models/4629",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323459524216229919/xy_grid-0079-2752658687-PureErosFace_V1highly20detailed20face_0.png?ex=6774973b&is=677345bb&hm=b4ced286df7dc5b18c438f8db76c3e141ad7fef369a07345465a07561f2d0b95&",
        },
        {
          embeddingName: "UnrealisticDream",
          embeddingModelType: "SD 1.5",
          embeddingUsage: "UnrealisticDream",
          embeddingDescription:
            "Negative prompt embedding, for realistic images",
          embeddingRecommends:
            "Use in combination with UnrealisticDream and FastNegativeV2",
          embeddingLink:
            "https://civitai.com/models/72437?modelVersionId=77173",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323459634169778216/3978526355-3183335445-120blonde20woman20upper20body20selfie20happy20masterpiece20best20quality20ultra-detailed20solo20outdoors20night20mountains20natu.png?ex=67749755&is=677345d5&hm=517946bcc96fe5d75278a24852bbd102c5e2f5105aaebb3397b66cedd55dc3cb&",
        },
        {
          embeddingName: "veryBadImageNegative",
          embeddingModelType: "SD 1.5",
          embeddingUsage: "verybadimagenegative_v1.3",
          embeddingDescription:
            "Negative prompt embedding, generic negative keywords",
          embeddingRecommends: "None",
          embeddingLink: "https://civitai.com/models/11772",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323459732144521237/283901.png?ex=6774976c&is=677345ec&hm=236b13ab8e48f96db0f18fbce6fb5306ee4382446c8b1161fa0b8b47596d0360&",
        },
        {
          embeddingName: "General Negative 1",
          embeddingModelType: "SD XL",
          embeddingUsage: "ac_neg1",
          embeddingDescription:
            "Negative prompt embedding, generic negative keywords",
          embeddingRecommends: "Use in combination with ac_neg2",
          embeddingLink: "https://civitai.com/models/148131",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323459821097189386/xyz_grid-0009-3287126477.png?ex=67749782&is=67734602&hm=6b53cea160c2ba75dc283453d008841a5d7b947e4d59cbc9d086b64b17daa8f7&",
        },
        {
          embeddingName: "General Negative 2",
          embeddingModelType: "SD XL",
          embeddingUsage: "ac_neg2",
          embeddingDescription:
            "Negative prompt embedding, generic negative keywords",
          embeddingRecommends: "Use in combination with ac_neg1",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=166375",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323459821097189386/xyz_grid-0009-3287126477.png?ex=67749782&is=67734602&hm=6b53cea160c2ba75dc283453d008841a5d7b947e4d59cbc9d086b64b17daa8f7&",
        },
        {
          embeddingName: "Deep Negative XL",
          embeddingModelType: "SD XL",
          embeddingUsage: "DeepNegative_xl_v1",
          embeddingDescription:
            "Negative prompt embedding, generic negative keywords",
          embeddingRecommends: "None",
          embeddingLink: "https://civitai.com/models/407448",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323460043160686722/xyz_grid-1082-2060917131-vampire20bridefilm20photography20aestheticthe20delicate20texture20of20lace20veil20gently20obscuring20her20facelong20blonde20hairlooking20at.png?ex=677497b6&is=67734636&hm=dc6be8a77cd03ae7c0db3538a0a805c067887c6ac9b52a956f00f75afb045e15&",
        },
        {
          embeddingName: "FastNegative",
          embeddingModelType: "SD XL",
          embeddingUsage: "FastNegative",
          embeddingDescription:
            "Negative prompt embedding, generic negative keywords",
          embeddingRecommends: "None",
          embeddingLink: "https://civitai.com/models/143607",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323460137297383495/4172892689-The20little20prince20and20his20fox20on20a20planet.png?ex=677497cd&is=6773464d&hm=51a13ffa3819d75e8af7959a39cee0af2530f78cd5a8806572f1f2a8c050bdfa&",
        },
        {
          embeddingName: "3D Embed",
          embeddingModelType: "SD XL",
          embeddingUsage: "SK_3DRENDER / SK_3DRENDER_NEG",
          embeddingDescription:
            "Has both a positive prompt usage and neg prompt usage, creates 3d render style",
          embeddingRecommends:
            "Use positive usage in prompt and negative usage in negative prompt together",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=167627",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323460211712725073/3drender.png?ex=677497df&is=6773465f&hm=46998821c321ab119a2654d58ea8d485d74b047583f45e94ae6a9a300ce84e3b&",
        },
        {
          embeddingName: "Analog Film",
          embeddingModelType: "SD XL",
          embeddingUsage: "SK_ANALOGFILM / SK_ANALOGFILM_NEG",
          embeddingDescription:
            "Has both a positive prompt usage and neg prompt usage, creates analog film style",
          embeddingRecommends:
            "Use positive usage in prompt and negative usage in negative prompt together",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=167631",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323460290377023548/analog.png?ex=677497f1&is=67734671&hm=72df1cca8e38e670fb881fb19b0b9de0353987e5707a1516c01e91596d4cf93f&",
        },
        {
          embeddingName: "Anime Embed",
          embeddingModelType: "SD XL",
          embeddingUsage: "SK_ANIME / SK_ANIME_NEG",
          embeddingDescription:
            "Has both a positive prompt usage and neg prompt usage, creates anime/cartoon style",
          embeddingRecommends:
            "Use positive usage in prompt and negative usage in negative prompt together",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=167630",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323460371310186496/anime.png?ex=67749805&is=67734685&hm=61d009ab7aa41aeec7b29fe5789550d847ca35bbd177af1d0377b2448058047e&",
        },
        {
          embeddingName: "Cinematic Embed",
          embeddingModelType: "SD XL",
          embeddingUsage: "SK_CINEMATIC / SK_CINEMATIC_NEG",
          embeddingDescription:
            "Has both a positive prompt usage and neg prompt usage, creates cinematic style",
          embeddingRecommends:
            "Use positive usage in prompt and negative usage in negative prompt together",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=167633",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323460486359945239/cinematic.png?ex=67749820&is=677346a0&hm=c66985213aabc6816b2a367b31b2e78cc4b7768572399101f79f710ac0e5cebb&",
        },
        {
          embeddingName: "Comic Embed",
          embeddingModelType: "SD XL",
          embeddingUsage: "SK_COMIC / SK_COMIC_NEG",
          embeddingDescription:
            "Has both a positive prompt usage and neg prompt usage, creates comic style",
          embeddingRecommends:
            "Use positive usage in prompt and negative usage in negative prompt together",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=167638",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323460559051427851/comic.png?ex=67749831&is=677346b1&hm=53a4d7504eefabe2ffa1592b131493d62bb93db7e3462609117029c24a6e4a66&",
        },
        {
          embeddingName: "Cyberpunk Embed",
          embeddingModelType: "SD XL",
          embeddingUsage: "SK_Cyberpunk / SK_Cyberpunk_NEG",
          embeddingDescription:
            "Has both a positive prompt usage and neg prompt usage, creates cyberpunk style",
          embeddingRecommends:
            "Use positive usage in prompt and negative usage in negative prompt together",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=167639",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323460637501952041/cyberpunk.png?ex=67749844&is=677346c4&hm=a34f65a5bd7e0e50691832d325c71624334bb8d8ae6acd1302eefb95f207831e&",
        },
        {
          embeddingName: "Digital Art",
          embeddingModelType: "SD XL",
          embeddingUsage: "SK_DIGITALART / SK_DIGITALART_NEG",
          embeddingDescription:
            "Has both a positive prompt usage and neg prompt usage, creates digital art style",
          embeddingRecommends:
            "Use positive usage in prompt and negative usage in negative prompt together",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=167640",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323460708368781362/digitalart.png?ex=67749855&is=677346d5&hm=a5ecf958141286d821016ab582c571de0e47151a00a4316537ff51297d4b03a2&",
        },
        {
          embeddingName: "Fantasy Embed",
          embeddingModelType: "SD XL",
          embeddingUsage: "SK_Fantasy / SK_Fantasy_NEG",
          embeddingDescription:
            "Has both a positive prompt usage and neg prompt usage, creates fantasy style",
          embeddingRecommends:
            "Use positive usage in prompt and negative usage in negative prompt together",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=167636",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323460784277295125/fantasy.png?ex=67749867&is=677346e7&hm=02d68ee0178518c6a84ce124dc7152a8ae94936cffd69b4179617663242d0467&",
        },
        {
          embeddingName: "Studio Ghibli",
          embeddingModelType: "SD XL",
          embeddingUsage: "SK_Ghibli",
          embeddingDescription:
            "Only positive prompt embed, helps create studio ghibli style",
          embeddingRecommends: "Use in combination with ac_neg1",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=167641",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323460869673451550/00648-2281034976.png?ex=6774987c&is=677346fc&hm=8941de79a3efec3da5e76d15e2facc12135a87651569bf303c1237aa5ba160cd&",
        },
        {
          embeddingName: "Vector Art",
          embeddingModelType: "SD XL",
          embeddingUsage: "SK_VECTORART",
          embeddingDescription:
            "Only positive prompt embed, helps create vector art style",
          embeddingRecommends: "None",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=167642",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323460946273763328/vectorart.png?ex=6774988e&is=6773470e&hm=1c78787b4d39f45f14487e3200ac67ff8d5259e13eacc0275078eed4b177a27a&",
        },
        {
          embeddingName: "unaestheticXL",
          embeddingModelType: "SD XL",
          embeddingUsage: "unaestheticXL2v10",
          embeddingDescription:
            "Negative prompt embedding, generic negative keywords",
          embeddingRecommends: "None",
          embeddingLink: "https://civitai.com/models/119032",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323461032361988126/BEC7069C1783AD6B0BB458BF42660223D609DEFBDDFA1ED037ED400ABA36F5CA.png?ex=677498a2&is=67734722&hm=f18f574580d4938b175cb9797f0c5049bf9a67fe649c0f401c5dfc8fb4dcd78b&",
        },
        {
          embeddingName: "ZIP2D Quality",
          embeddingModelType: "SD XL",
          embeddingUsage: "ZIP2D",
          embeddingDescription:
            "Positive prompt embedding for 2D art, generic quality keywords",
          embeddingRecommends: "None",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=165465",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323461130739257385/xyz_grid-0033-3539502405.png?ex=677498ba&is=6773473a&hm=6b6211fd4b14d12a74db4f2c35cab0d08162119a55f68fc78b8c58e21e9ad632&",
        },
        {
          embeddingName: "ZIP2D Negative",
          embeddingModelType: "SD XL",
          embeddingUsage: "zip2d_neg",
          embeddingDescription:
            "Negative prompt embedding for 2D art, generic negative keywords",
          embeddingRecommends: "None",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=165451",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323461204529647676/xyz_grid-0022-2778206585.png?ex=677498cb&is=6773474b&hm=0c5b91a1ca8a833871f1c00db4611d55f6d46fa5f4fcfa52f6bbb77930e7a77b&",
        },
        {
          embeddingName: "ZIP Realism",
          embeddingModelType: "SD XL",
          embeddingUsage: "ziprealism",
          embeddingDescription:
            "Positive prompt embedding for realism, generic prompt keywords",
          embeddingRecommends: "None",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=165259",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323461291364319442/20240108_224012_3062513406_TamarinXL_v10.png?ex=677498e0&is=67734760&hm=b103b4773a7a98bd6c4d2a41df02b6cdde41b84cd52124117fbca89d1c106883&",
        },
        {
          embeddingName: "ZIP Realism Negative",
          embeddingModelType: "SD XL",
          embeddingUsage: "ziprealism_neg",
          embeddingDescription:
            "Negative prompt embedding for realism, generic negative keywords",
          embeddingRecommends: "None",
          embeddingLink:
            "https://civitai.com/models/148131?modelVersionId=165424",
          embeddingImage:
            "https://cdn.discordapp.com/attachments/1323450875363987528/1323461361631494264/CC087A257C9F056D0F9BA868EEC61FB66D4CCEED876D4AC54FB5F11ECAC516FA.png?ex=677498f1&is=67734771&hm=062bf1b2d0189c6dd152cb158d5401d4a93f6fa99d17b223b686c6fc26689b05&",
        },
      ];
      let embeddingMatch = {};
      embeddingArray.forEach((embedding) => {
        if (selectedValue == embedding.embeddingName) {
          embeddingMatch = embedding;
        }
      });

      // Rebuild lora row with placeholder
      const embeddingRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder(
          interaction.component.toJSON()
        ).setPlaceholder(selectedValue)
      );
      // Build model info embed
      const embeddingInfoEmbed = new EmbedBuilder()
        .setColor(0x9e41ff)
        .setTitle("SD Info")
        .setAuthor({ name: `${botNickname}`, iconURL: botPFP })
        .addFields(
          { name: "Info Type", value: `${firstSelectValue}` },
          { name: "Model", value: `${secondSelectValue}` },
          { name: "Embedding", value: `${selectedValue}` },
          {
            name: "Compatible Base",
            value: `${embeddingMatch.embeddingModelType}`,
          },
          {
            name: "Usage (Negatives in negative, styles in prompt)",
            value: `${embeddingMatch.embeddingUsage}`,
          },
          {
            name: "Description",
            value: `${embeddingMatch.embeddingDescription}`,
          },
          {
            name: "Recommendations",
            value: `${embeddingMatch.embeddingRecommends}`,
          },
          { name: "Civitai Link", value: `${embeddingMatch.embeddingLink}` }
        )
        .setImage(embeddingMatch.embeddingImage)
        .setTimestamp()
        .setFooter({ text: `${nickname}`, iconURL: userPFP });

      await interaction.update({
        content: " ",
        embeds: [embeddingInfoEmbed],
        components: [
          interaction.message.components[0],
          interaction.message.components[1],
          embeddingRow,
        ],
      });
    }
  },
};
