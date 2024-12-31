// ================================================================================
// Project: Stable Diffusion Discord Bot
// File: deploy-commands.js
// Description: Deploy commands to the Discord bot.
// Author: Nolan Olhausen
// ================================================================================

// Require necessaries
require("dotenv").config();
const { REST, Routes } = require("discord.js");
const { clientId, guildId } = require("../botConfig.json");
const fs = require("node:fs");
const path = require("node:path");

// Async for dynamic
const deployCommands = async () => {
  const commands = [];

  // Grab all the command folders from the commands directory
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        // wait for promise
        try {
          const data = await command.data(); // Await the data resolution

          if (data) {
            commands.push(data);
            console.log(`Deployed command ${data.name}`);
          } else {
            console.log(
              `Failed to deploy command ${filePath}: data is undefined.`
            );
          }
        } catch (error) {
          console.error(`Error deploying command ${filePath}:`, error);
        }
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(process.env.TOKEN);
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
};

// Run
deployCommands();
