const Sequelize = require('sequelize');

const modelName = "Transaction";
module.exports = sequelize => ({
  modelName,
  associate: ({ Transaction, Charger, MeterValue }) => {
    Transaction.belongsTo(Charger);
    Transaction.hasMany(MeterValue);
  },
  model: sequelize
    .define(modelName, {
      connectorId: { type: Sequelize.INTEGER, allowNull: false },
      meterStart: { type: Sequelize.INTEGER, allowNull: false },
      timestampStart: { type: Sequelize.DATE, allowNull: false },
      meterStop: { type: Sequelize.INTEGER },
      timestampEnd: { type: Sequelize.DATE },
      current: { type: Sequelize.BOOLEAN },
      powerConsumed: { type: Sequelize.INTEGER },
    },
    {
      freezeTableName: true,
      tableName: 'transaction'
    })
});
