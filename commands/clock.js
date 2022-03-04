const Discord = require("discord.js")
const Database = require("@replit/database")
const db = new Database()
const cooldown = 3600 // seconds

// ADD WARNING IF IT IS NIGHT TIME
function isNight() {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var lt = new Date(utc - (3600000 * 5)); // local time: EST (UTC+5)
    var h = lt.getHours()
    if (h < 7 || h > 22) return true;
    return false
    // return "The local time is " + nd.toLocaleString();
}
function SecondstoTime(seconds) {
    date = new Date(seconds * 1000)
    h = date.getUTCHours()
    m = date.getUTCMinutes()
    s = date.getSeconds()
    timeString = h.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0")
    return timeString
}
module.exports.run = (client, msg, args) => {
    clock_now = Date.now()
    db.get("start_time").then(start_time => {
    db.get("last_reap_time").then(last_reap_time => {
    db.get("players").then(players => {
    db.get("reap_times").then(reap_times => {
    if (!start_time) return msg.channel.send("Game has not started!");
    if (players.includes(msg.author.username)) {
        var available_msg = (clock_now - reap_times[players.indexOf(msg.author.username)]) > (cooldown * 1000) ? "Reap available!" : `${SecondstoTime(Math.round(cooldown - (clock_now - reap_times[players.indexOf(msg.author.username)]) / 1000))} until next reap!`;
    } else var available_msg = "Reap available!";
    let clock = new Discord.MessageEmbed()
    .setColor("YELLOW")
    .setTitle(`${Math.round((clock_now - last_reap_time) / 1000)} second(s)`)
    .setDescription(`${available_msg}`)
    .setAuthor({
        name: msg.author.username,
        iconURL: msg.author.displayAvatarURL()
    })
    msg.channel.send({embeds:[clock]})
    })
    })
    })
    })
}
exports.name = "clock"