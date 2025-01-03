const {DataTypes, sequelize} = require("../lib/");

let department = sequelize.define("department", {
    name: DataTypes.STRING
});

module.exports = { department };