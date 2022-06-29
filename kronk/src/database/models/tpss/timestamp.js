const Sequelize = require('sequelize');

const modelName = 'Timestamp';
module.exports = sequelize => ({
  modelName,
  associate: ({ Timestamp, AnalogEntry, DigitalEntry }) => {
    Timestamp.hasMany(AnalogEntry);
    Timestamp.hasMany(DigitalEntry);
  },
  model: sequelize
    .define(modelName, {
      time: { type: Sequelize.DATE, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'timestamp',
    }),
});