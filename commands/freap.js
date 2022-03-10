const Database = require("@replit/database")
const db = new Database()

module.exports.run = (client, msg, args) => {
    msg.channel.send("Not available currently.")
}
exports.name = "freap"