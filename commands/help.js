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
    .addField("Settings", "50% chance player ranked below steals time (11PM-7AM EST)\n30% tax at night (does not apply to donation)")
    msg.channel.send({embeds:[help_msg]})
}
exports.name = "help"