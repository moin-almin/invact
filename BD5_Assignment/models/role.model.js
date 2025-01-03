const {DataTypes, sequelize} = require("../lib/");

let role = sequelize.define("role", {
    title: DataTypes.STRING
});

module.exports = { role };