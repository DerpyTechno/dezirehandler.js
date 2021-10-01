const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

class handler {
  constructor(
    options = { folder: String, owner: String, prefix: String, client: Object }
  ) {
    this.options = options;
    if (!this.options.folder) throw new Error("🚫You must enter a file path!");
    if (!this.options.owner) throw new Error("🚫You must enter a owner ID");
    if (!this.options.prefix) throw new Error("🚫You must enter a prefix");
    if (!this.options.client) throw new Error("🚫You must enter client");
  }
  start() {
    const bot = this.options.client;
    const prefix = this.options.prefix;
    const owner = this.options.owner;
    bot.commands = new Discord.Collection();
    bot.cooldowns = new Discord.Collection();

    const commandFolders = fs.readdirSync(`./${this.options.folder}`);
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./${this.options.folder}/${folder}/`)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = require(path
          .resolve(`${this.options.folder}/${folder}/${file}`)
          .replace("./", "/"));
        if (!command.name || !command.code) {
          console.log(
            `🚫Command Could Not Load:\n${folder}/${file}`);
        } else {
          console.log(
            `✅Command Loaded Successfully:\n${folder}/${file}`);
        }
        bot.commands.set(command.name, command);
      }
    }

    bot.on("message", (message) => {
      if (!message.content.startsWith(prefix) || message.author.bot) return;
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      require("./commandHandler")(message, args, bot, owner);
    });
  }
}

module.exports = handler;
console.log('Currently Using DezireHandler.js v1.0.0!');