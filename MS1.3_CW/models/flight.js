module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'flight', {
            origin: DataTypes.String,
            destination: DataTypes.String,
            flight_number: DataTypes.String,
            departure_time: DataTypes.DATE,
            arrival_time: DataTypes.DATE,
            price: DataTypes.FLOAT,
        },
        {
            timestamps: true,
        }
    );
}

