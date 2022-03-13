const Discord = require("discord.js")
const { Permissions } = require("discord.js")
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"],
    disableMentions: "everyone"
})

const express = require("express")
const app = express()
app.listen(3000, () => {
    console.log("OPERATIONAL")
})
app.get("/", (req, res) => {
    res.send("OPERATIONAL")
})

const fs = require("fs")
client.commands = new Discord.Collection()
const commands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
for (file of commands) {
    const commandName = file.split(".")[0]
    const command = require(`./commands/${commandName}`)
    client.commands.set(commandName, command)
}

const prefix = "$"

const Database = require("@replit/database")
const db = new Database()
db.list().then((keys) => {
    console.log(`KEYS: ${keys.join(", ")}`)
})
// db.delete("start_time").then(() => {});

client
    .on("debug", console.log)
    .on("warn", console.log)

// client.on('messageDelete', message => {
//     if (!message.author.bot) return message.channel.send(`"${message.content}" by ${message.author.tag} was deleted.`);
//     message.channel.send(message.content)
// })
client.on("ready", async() => {
    client.user.setPresence({ activities: [{ name: 'for night reapers', type: 'WATCHING'}], status: 'online' });
})

client.on("messageCreate", msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    if (!msg.guild.me.permissionsIn(msg.channel).has(Permissions.FLAGS.EMBED_LINKS)) return;
    if (!msg.guild.me.permissionsIn(msg.channel).has(Permissions.FLAGS.SEND_MESSAGES)) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g)
    const commandName = args.shift()
    const command = client.commands.get(commandName)
    if (!command) return msg.channel.send(`That command does not exist!`)
    command.run(client, msg, args)
})

// client.on("messageCreate", message => {
//     var tag = message.content.slice(1).split(" ")
//     if (tag[0] === "end") {
//     }
// })

client.login(process.env.TOKEN)