const Discord = require("discord.js")
    , config = require("./config")
    , client = new Discord.Client()
    , db = require("./src/db/connect")
    , gachaRouter = require("./src/gachaRoutes");

var gachaDB = db.newDB('./database/gachiGacha.db');
db.initDB(gachaDB);
db.closeDB(gachaDB);

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {

  var msg = message.content
     ,pf = config.getPrefix();

  if (!msg.startsWith(pf) || message.author.bot) return;
  msg = msg.slice(1);

  if (msg.startsWith("ping")) {
    pingpong(message);
  } else
  if (msg.startsWith("foo")) {
    foobar(message);
  } else
  if (msg.startsWith("prefix")) {
    prefixMod(message);
  } else
  if (msg.startsWith("gacha ")) {
    gachaRouter(message);
  }
  else {
    message.channel.send("Invalid commando yo");
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  console.log(reaction.message.content)

});

function pingpong(message) {
  var ret = message.content.slice(5);
  message.channel.send("Pong!\n" + ret + "\n===");
}

function foobar(message) {
  var ret = message.content.slice(3);
  var userID = message.author.id;
  message.channel.send("bar! " + userID);
}

function prefixMod(message) {
  var prefix = message.content.slice(8);
  config.setPrefix(prefix);
  message.channel.send("Prefix is now set to " + config.getPrefix());
}

client.login(config.token);
