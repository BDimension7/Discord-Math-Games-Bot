const Database = require("@replit/database")
const db = new Database()

module.exports.run = (client, msg, args) => {
    msg.reply(`${args}`)
}
exports.name = "add"