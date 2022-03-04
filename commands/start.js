const Database = require("@replit/database")
const db = new Database()

module.exports.run = (client, msg, args) => {
    if (msg.author.id != process.env.ADMIN) return msg.channel.send("You are not authorized!");
    db.get("start_time").then((tag) => {
        if (tag) return msg.channel.send("Game has already started!");
        start_time = Date.now()
        db.set("start_time", start_time)
        db.set("last_reap_time", start_time)
        db.set("players", [])
        db.set("scores", [])
        db.set("reap_times", [])
        db.set("reap_counts", [])
        msg.channel.send(`New game started by ${msg.author.username}`)
    })
}
exports.name = "start"