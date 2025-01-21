module.exports = (sequelize, DataTypes) => {
    return sequelize.define('photo', {
        imageUrl: DataTypes.STRING,
        description: DataTypes.STRING,
        altDescription: DataTypes.STRING,
        dateSaved: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {model: 'users', key: 'id'}
        }
    });
}