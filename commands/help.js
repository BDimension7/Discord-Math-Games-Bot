const Discord = require("discord.js")
const Database = require("@replit/database")
const db = new Database()

module.exports.run = (client, msg, args) => {
    let help_msg = new Discord.MessageEmbed()
    .setColor("YELLOW")
    .setAuthor({
        name: "BDimension7's Math Games Bot",
        iconURL: msg.guild.me.displayAvatarURL()
    })
    .addField("Commands", "$reap\n$freap (free reap)\n$lb (leaderboard)\n$clock\n$help\n$info (soon)\n$duel (soon)")
    .addField("Changelog", "cooldown: 1 hour\nanti-night-reaping measures: 25% chance of -1 and donating points to random other player")
    msg.channel.send({embeds:[help_msg]})
}
exports.name = "help"