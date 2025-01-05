const { DataTypes, sequelize } = require('../lib');

const role = sequelize.define('role', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
})

module.exports = {
    role
};