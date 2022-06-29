const Sequelize = require('sequelize');

const modelName = 'Chargepoint';
module.exports = sequelize => ({
    modelName, 
    associate: ({ Chargepoint, ChargepointEntry }) => {
        Chargepoint.hasMany(ChargepointEntry);
    },

    model: sequelize
        .define(modelName, {
            id: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true }
        },
        {
            freezeTableName: true,
            tableName: 'chargepoint',
        }),
});