module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tag', {
        name: DataTypes.STRING,
        photoId: {
            type: DataTypes.INTEGER,
            references: { model: 'photos', key: 'id' }
        }
    });
}