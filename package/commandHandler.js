const Discord = require('discord.js');
const client = new Discord.Client();
const { MessageEmbed } = require('discord.js');
const inlineReply = require('inlinereply');

module.exports = (message, args, bot, owners) => {
  function replaceMessage(msg, msg2, boolean, commandoName) {
    const sendMessage = msg2
      .replace(/{user.id}/g, msg.author.id)
      .replace(/{user.name}/g, msg.author.username)
      .replace(/{user.discrim}/g, msg.author.discriminator)
      .replace(/{command.name}/g, commandoName);
    if (boolean == true) {
      return msg.channel
        .send(sendMessage)
        .then((message) => message.delete({ timeout: 5000 }));
    } else {
      return msg.channel.send(sendMessage);
    }
  }
  function cooldownReplaceMessage(msg, msg2, boolean, second, commandoName) {
    const sendMessage = msg2
      .replace(/{user.id}/g, msg.author.id)
      .replace(/{user.name}/g, msg.author.username)
      .replace(/{user.discrim}/g, msg.author.discriminator)
      .replace(/{time}/g, second.toFixed(1))
      .replace(/{command.name}/g, commandoName);

    if (boolean == true) {
      return msg.channel
        .send(sendMessage)
        .then((message) => message.delete({ timeout: second * 1000 }));
    } else {
      return msg.channel.send(sendMessage);
    }
  }
  function permReplaceMessage(msg, msg2, boolean, commandoName, commandPerm) {
    const sendMessage = msg2
      .replace(/{user.id}/g, msg.author.id)
      .replace(/{user.name}/g, msg.author.username)
      .replace(/{user.discrim}/g, msg.author.discriminator)
      .replace(/{command.name}/g, commandoName)
      .replace(/{perm}/g, commandPerm);
    if (boolean == true) {
      return msg.channel
        .send(sendMessage)
        .then((message) => message.delete({ timeout: 5000 }));
    } else {
      return msg.channel.send(sendMessage);
    }
  }
  const commandName = args.shift().toLowerCase();
  const command =
    bot.commands.get(commandName) ||
    bot.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  if (command.guildOnly && message.channel.type === "dm") {
    if (command.guildOnly.status) {
      if (command.guildOnly.errorMsg) {
        return replaceMessage(
          message,
          command.guildOnly.errorMsg,
          command.guildOnly.deletable,
          command.name
        );
      } else {
        return message.inlineReply(new MessageEmbed()
.setTitle(`:x: | An Error Occured`)
.setDescription(`I can't execute that command inside DMs!`)
.setColor('ff0000')
.setTimestamp());
      }
    }
  }

  if (command.ownerOnly) {
    if (command.ownerOnly.status) {
      if (owners.includes(message.author.id) === false) {
        if (command.ownerOnly.errorMsg) {
          return replaceMessage(
            message,
            command.ownerOnly.errorMsg,
            command.ownerOnly.deletable,
            command.name
          );
        } else {
          return message.inlineReply(new MessageEmbed()
.setTitle(`:x: | An Error Occured`)
.setDescription(`This is a Owner Only command!`)
.setColor('ff0000')
.setTimestamp());
        }
      }
    }
  }

  if (command.permissions) {
    const authorPerms = message.channel.permissionsFor(message.author);
    if (command.permissions.perm) {
      if (!authorPerms || !authorPerms.has(command.permissions.perms)) {
        if (command.permissions.errorMsg) {
          return permReplaceMessage(
            message,
            command.permissions.errorMsg,
            command.permissions.deletable,
            command.name,
            command.permissions.perm
          );
        } else {
          return message.inlineReply(new MessageEmbed()
.setTitle(`:x: | An Error Occured`)
.setDescription(`You require more permissions to run \`${command.name}\`!`)
.setColor('ff0000')
.setTimestamp());
        }
      }
    }
  }

  if (command.args && !args.length) {
	const prefix = (process.env.PREFIX);
	  
    let reply = `You didn't provide enough arguments\n`;
if(command.usage) {
      reply += `Correct Usage: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.inlineReply(reply);
  }

  const { cooldowns } = bot;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  if (command.cooldown) {
    if (command.cooldown.time) {
      const cooldownAmount = (command.cooldown.time || 3) * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime =
          timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          if (command.cooldown.errorMsg) {
            return cooldownReplaceMessage(
				message, command.cooldown.errorMsg,
command.cooldown.deletable,
              timeLeft,
              command.name
            );
          } else {
            return message.inlineReply(new MessageEmbed().setDescription(`Please wait **${timeLeft.toFixed(1)} ** more second(s) before reusing the \`${command.name}\`!`).setColor('ff0000')
            );
          }
        }
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
  }
  try {
    command.code(message, args, bot);
  } catch (error) {
    console.error(error);
    message.inlineReply(new MessageEmbed()
.setTitle(`:x: | An Error Occured`)
.setDescription(`There was an error trying to execute that command!`)
.addField('Error Log', `${error}`)
.setColor('ff0000'));
  }
};