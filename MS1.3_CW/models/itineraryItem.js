module.exports = (sequelize, DataTypes) => {
    const itineraryItem = sequelize.define('itineraryItem', {
            itineraryId: {
                type: DataTypes.Integer,
                allowNull: false,
                reference: {model: "itinerary", key: "id"},
            },
            itemId: {
                type: DataTypes.Integer,
            },
            type: {
                type: DataTypes.String
            }
        },
        {
            timestamps: true,
        }
    )

    itineraryItem.associate = (models) => {
        itineraryItem.belongsTo(models.itinerary, {foreignKey: "itineraryId"});
    }

    return itineraryItem;
}