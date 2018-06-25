const Discord = require("discord.js")
    , config = require("./config")
    , client = new Discord.Client()
    , db = require("./src/db/connect")
    , gachaRouter = require("./src/gachaRoutes");

var gachaDB = db.newDB('./database/gachiGacha.db');
db.initDB(gachaDB);
//db.insertUser(gachaDB);
db.closeDB(gachaDB);

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {

  var msg = message.content
     ,pf = config.prefix;

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
  let newPrefix = message.content.split(" ").slice(1, 2)[0];
  config.prefix = newPrefix;
  fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  message.channel.send("Prefix is now set to " + config.prefix);
}

client.login(config.token);
