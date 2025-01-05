const {DataTypes, sequelize} = require("../lib/");

let department = sequelize.define("department", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

module.exports = {
    department,
};