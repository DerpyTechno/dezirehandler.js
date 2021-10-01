# DezireHandler.js v1.0.0
Is one of the easiest command handlers for Discord.js V12 with alot of features from arguments, error messages, permissions and much more!

## DezireHandler Examples
- [Installation](#install)
- [Setup](#setup)
- [Example Usage](#example)
- [Standard](#standard-using-example)
- [Error message](#error-example)
- [Aliases](#aliases-example)
- [Usage & Args](#usage-and-args-example)
- [Cooldown](#cooldown-example)
- [Guild Only](#guild-only-command-example)
- [Owner Only](#owner-only-command-example)
- [Require Perms & Require Args](#require-permission--require-args)
- [Avaliable keys](#keys)

## Install
```bash
npm install dezirehandler@latest
```

## Example

### Setup
```js
const Discord = require("discord.js");
const client = new Discord.Client();
const cmd = require("dezirehandler");

const handler = new cmd.Handler({
  folder: "./commands", //required
  client: client, //required
  prefix: process.env.PREFIX, //required
  owner: ["The owner ID"], //required , add more owner ID's if you would like
});

handler.start();
client.login(process.env.TOKEN);
```

### Standard using example
```js
const Discord = require("discord.js");

module.exports = {
  name: "ping",
  description: "Ping!!",
  code: (message, args, client) => {
    //Your code here
    message.channel.send("Pong");
  },
};
```

### Cooldown example
```js
const Discord = require("discord.js");

module.exports = {
  name: "ping",
  cooldown: {
    time: 3,
  },
  description: "Ping!",
  code: (message, args, client) => {
    //Your code here
    message.channel.send("Pong");
  },
};
```

### Error example
```js
const Discord = require("discord.js");

module.exports = {
  name: "error",
  cooldown: {
    time: 3,
    errorMsg:
      "You can use the `{command.name}` after {time} seconds.",
    deletable: true,
  },
  description: "This is a error message",
  code: (message, args, client) => {
    //Your code here
    message.channel.send("Error message example");
  },
};
```

### Aliases example
```js
const Discord = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["delay"],
  description: "Check if the bot is online",
  code: (message, args, client) => {
    //Your code here
    message.channel.send("Pong");
  },
};
```

### Usage and Args example
```js
const Discord = require("discord.js");

module.exports = {
  name: "ping",
  args: "1", //required
  usage: "bot",
  description: "Ping!",
  code: (message, args, client) => {
    //Your code here
    message.channel.send("Pong");
  },
};
```

### Require permission & Require args
```js
const Discord = require("discord.js");

module.exports = {
  name: "ban",
  permission: {
    perm: "BAN_MEMBERS",
    deletable: true,
  },
  args: 1,
  description: "Ban the mentioned member",
  code: (message, args, client) => {
    //Your code here
message.guild.member.ban(message.mention.first());
  },
};
```

### Guild only command example
```js
const Discord = require("discord.js");

module.exports = {
  name: "guildonly",
  guildOnly: {
    status: true,
  },
  description: "The guild only example",
  code: (message, args, client) => {
	  //Your code here
message.channel.send(`${message.guild.name}`);
  },
};
```

### Owner only command example
```js
const Discord = require("discord.js");

module.exports = {
  name: "server-icon",
  ownerOnly: {
    status: true,
    deletable: false,
  },
  description: "Get the server icon"
  code: (message, args, client) => {
    //Your code here
    message.channel.send(
      message.guild.iconURL({ display: true, format: "png" })
    );
  },
};
```

### Keys
- {user.id} - return `message.author.id`
- {user.name} - return `message.author.username`
- {user.discrim} - return `message.author.discriminator`
- {command.name} - return used command name
- {time} - return left time from cooldowns (only cooldowns)
- {perm} - return require perm for use command (only for require permission)
