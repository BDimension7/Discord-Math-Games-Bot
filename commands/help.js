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
    .addField("Settings", "cooldown: 1 hour\n50% chance of player ranked below stealing time at night (10PM-7AM EST)")
    msg.channel.send({embeds:[help_msg]})
}
exports.name = "help"