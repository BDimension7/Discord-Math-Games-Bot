const Discord = require("discord.js")
const Database = require("@replit/database")
const db = new Database()
const cooldown = 3600 // seconds

function hasReward(msg) {
    role = msg.guild.roles.cache.find((role) => {return role.name === process.env.REWARD_ROLE});
    if (!role) return msg.channel.send(`ERROR: good role ${process.env.REWARD_ROLE} no exist `);
    member = msg.guild.members.cache.get(msg.author.id);
    if (!member.roles.cache.get(role.id)) return false;
    return true
}
function isNight() {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var lt = new Date(utc - (3600000 * 5)); // local time: EST (UTC+5)
    var h = lt.getHours()
    if (h < 7 || h > 21) return true;
    return false
    // return "Local time is " + nd.toLocaleString();
}
function SecondstoTime(seconds) {
    date = new Date(seconds * 1000)
    h = date.getUTCHours()
    m = date.getUTCMinutes()
    s = date.getSeconds()
    timeString = h.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0")
    return timeString
}
function setMultiplier() {
    n = Math.floor(Math.random() * 1000);
    var factor = 1
    var message = ""
    if (!(n % 10)) factor = 2;
    if (!(n % 60)) factor = 3;
    if (!(n % 80)) factor = 4;
    if (!(n % 100)) factor = 5;
    if (!(n % 200)) factor = 8;
    switch (factor) {
        case 2:
            message = "Double reap!!";
            break;
        case 3:
            message = "Triple reap!!!";
            break;
        case 4:
            message = "Quadruple reap!!!!";
            break;
        case 5:
            message = "Quintuple reap!!!!!";
            break;
        case 8:
            message = "Octuple reap!!!!!!!!";
    }
    return [factor, message]
}
function setFreeReap() {
    n = Math.floor(Math.random() * 1000);
    if (!(n % 10)) return true;
    return false;
}

module.exports.run = (client, msg, args) => {
db.get("last_reap_time").then(last_reap_time => {
db.get("players").then(players => {
db.get("scores").then(scores => {
db.get("reap_times").then(reap_times => {
db.get("reap_counts").then(reap_counts => {
    if (!last_reap_time) return msg.channel.send("No game running!");
    time = Date.now()
    multiplier = setMultiplier()
    message = multiplier[1]
    time_reaped = (time - last_reap_time) * multiplier[0]
    freeReap = setFreeReap()
    const sorted_players = Array.from(Array(players.length), (x,i) => i)
    sorted_players.sort(function (a, b) {
        if (scores[a] === scores[b]) return 0;
        return (scores[a] < scores[b]) ? 1: -1
    })
    if (!players.includes(msg.author.username)) {
        if (isNight()) var desc = "You're a new player! Beware the anti-night-reaping measures next time! Sleep is important."
        players.push(msg.author.username)
        scores.push(time_reaped)
        if (!freeReap) reap_times.push(time);
        else reap_times.push(time - cooldown * 1000);
        reap_counts.push(1)
        db.set("players", players)
        db.set("last_reap_time", time)
        var color = "AQUA"
        var title = `You reaped ${Math.round(time_reaped / 1000)} second(s)!${message}`
        var desc = !freeReap ? `${SecondstoTime(cooldown)} until next reap.` : "**Free** reap available!"
    } else {
        if (time - reap_times[players.indexOf(msg.author.username)] > cooldown * 1000) {
            reap_times[players.indexOf(msg.author.username)] = !freeReap ? time : time - cooldown * 1000
            var desc = !freeReap ? `${SecondstoTime(cooldown)} until next reap.` : "**Free** reap available!"
            var color = "AQUA"
            var title = `You reaped ${Math.round(time_reaped / 1000)} second(s)! ${message}`
            if (isNight()) {
                if (!(Math.floor(Math.random() * 4) % 2)) {
                    if (players.indexOf(msg.author.username) == players.length - 1) {
                        color = "DARK_RED"
                        title = `You burned ${time_reaped / 1000} seconds!`
                        desc = "**WARNING**\nNight-reaper detection caught you!\nTime burned."
                    } else {
                        color = "GOLD"
                        title = `You donated ${time_reaped / 1000} seconds to\n${players[sorted_players[sorted_players.indexOf(players.indexOf(msg.author.username)) + 1]]}!`
                        desc = "**WARNING**\nNight-reaper detection caught you!\nTime donated to player ranked below you."
                        scores[sorted_players[sorted_players.indexOf(players.indexOf(msg.author.username)) + 1]] += time_reaped
                    }
                } else {
                    scores[players.indexOf(msg.author.username)] += time_reaped
                    desc += "\nAnti-night-reaper detection spared you this time!\n50% chance of donating time to player one rank below (10PM-7AM EST)!"
                }
            }
            reap_counts[players.indexOf(msg.author.username)] += 1
            db.set("last_reap_time", time)
        } else {
            var color = "GREY"
            var title = "No reap available!"
            var desc = `${SecondstoTime(Math.round(cooldown - (time - reap_times[players.indexOf(msg.author.username)]) / 1000))} until next reap!`
        }
    }
    db.set("reap_times", reap_times)
    db.set("scores", scores)
    db.set("reap_counts", reap_counts)
    let reap_msg = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(desc)
    .setAuthor({
        name: msg.author.username,
        iconURL: msg.author.displayAvatarURL()
    })
    .addField("Score:", `${Math.round(scores[players.indexOf(msg.author.username)] / 1000)} seconds`)
    msg.channel.send({embeds:[reap_msg]})
})
})
})
})
})
}
exports.name = "reap"