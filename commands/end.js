const Database = require("@replit/database")
const db = new Database()

module.exports.run = (client, msg, args) => {
    if (msg.author.id != process.env.ADMIN) return msg.channel.send("You are not authorized!");
    db.get("start_time").then(start => {
        if (!start) return msg.channel.send("No game in progress!");
        db.delete("start_time")
        db.delete("last_reap_time")
        db.delete("players")
        db.delete("scores")
        db.delete("reap_times")
        db.delete("reap_counts")
        msg.channel.send(`Game ended by ${msg.author.username}`)
    })
}
exports.name = "end"