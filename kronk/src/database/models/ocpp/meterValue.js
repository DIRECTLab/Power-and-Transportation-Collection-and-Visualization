const Sequelize = require('sequelize');

const modelName = 'MeterValue';
module.exports = sequelize => ({
  modelName,
  associate: ({ MeterValue, Transaction, SampledValue }) => {
    MeterValue.belongsTo(Transaction);
    MeterValue.hasMany(SampledValue);
  },
  model: sequelize
    .define(modelName, {
      timestamp: { type: Sequelize.DATE },
    },
    {
      freezeTableName: true,
      tableName: 'metervalue'
    })
});
