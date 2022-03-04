const Discord = require("discord.js")
const Database = require("@replit/database")
const db = new Database()

function displayLeaderboard(msg) {
db.get("players").then(players => {
db.get("scores").then(scores => {
db.get("reap_counts").then(reap_counts => {
    if (!players) return msg.channel.send("No games in progress!");
    if (players.length < 1) return msg.channel.send("No scores available.");
    var max = 0
    for (i = 0; i < players.length; i++) {
        if (players[i].length > max) {
            max = players[i].length
        }
    }
    function duplicate(s1, n) {
        s2 = ""
        for (i = 0; i < n; i++) {
            s2 = s2 + s1
        }
        return s2
    }
    var player_scores = players.map(function (username, player) {
        return [username, Math.round(scores[player] / 1000), reap_counts[player]]
    })
    player_scores.sort(function (a, b) {
        if (a[1] === b[1]) {
            return 0
        }
        return (a[1] < b[1]) ? 1: -1
    })
    var scores_message = "```"
    var rank = `${player_scores.length + 1}.`
    var rank_space = rank.length
    for (j = 0; j < player_scores.length; j++) {
        rank = `${j + 1}. [${player_scores[j][2]}] `
        scores_message += rank + duplicate(" ", rank_space - rank.length + 1) + player_scores[j][0] + duplicate(" ", max - player_scores[j][0].length + 1) + player_scores[j][1] + "\n"
    }
    let leaderboard = new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle("Leaderboard")
    .setDescription(scores_message + "```")
    msg.channel.send({embeds:[leaderboard]})
})
})
})
}

module.exports.run = (client, msg, args) => {displayLeaderboard(msg)}
exports.name = "lb"