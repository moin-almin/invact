module.exports = (sequelize, DataTypes) => {
    const site = sequelize.define("site", {
        name: DataTypes.String,
        location: DataTypes.String,
        description: DataTypes.String,
    }, {
        timestamps: true,
    })

    return site;
}