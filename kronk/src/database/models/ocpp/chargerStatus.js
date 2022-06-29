const Sequelize = require('sequelize');

const modelName = "ChargerStatus";
module.exports = sequelize => ({
  modelName,
  associate: ({ ChargerStatus, Charger }) => {
    ChargerStatus.belongsTo(Charger);
  },
  model: sequelize
    .define(modelName, {
      connected: { type: Sequelize.BOOLEAN, allowNull: false },
      statusTime: { type: Sequelize.DATE, allowNull: false },
      status: {type: Sequelize.STRING, defaultValue: 'unknown' },
    },
    {
      freezeTableName: true,
      tableName: 'chargerstatus',
    }),
});