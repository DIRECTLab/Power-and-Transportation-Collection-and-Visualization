const Sequelize = require('sequelize');

const modelName = "SampledValue";
module.exports = sequelize => ({
  modelName,
  associate: ({ SampledValue, MeterValue }) => {
    SampledValue.belongsTo(MeterValue);
  },
  model: sequelize
    .define(modelName, {
      value: { type: Sequelize.STRING(50) },
      context: { type: Sequelize.STRING(20) },
      valueFormat: { type: Sequelize.STRING(14) },
      measurand: { type: Sequelize.STRING(40) },
      location: { type: Sequelize.STRING(10) },
      unit: { type: Sequelize.STRING(15) }
    },
    {
      freezeTableName: true,
      tableName: 'sampledvalue'
    })
});

