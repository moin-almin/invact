module.exports = (sequelize, DataTypes) => {
    return sequelize.define("hotel", {
        name: DataTypes.String,
        location: DataTypes.String,
        price_per_night: DataTypes.FLOAT,
        available_rooms: DataTypes.Integer,
    }, {
        timestamps: true,
    });
}