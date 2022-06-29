const Sequelize = require('sequelize');

const modelName = 'ChargepointEntry';
module.exports = sequelize => ({
    modelName,
    associate: ({Chargepoint, ChargepointEntry }) => {
        ChargepointEntry.belongsTo(Chargepoint);
    },

    model: sequelize
        .define(modelName, {
            id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, unique: true, autoIncrement: true },
            portNumber: { type: Sequelize.INTEGER },
            status: { type: Sequelize.STRING },
            timestamp: { type: Sequelize.DATE },
        },
        {
            freezeTableName: true,
            tableName: 'chargepointEntry',
        }),
});