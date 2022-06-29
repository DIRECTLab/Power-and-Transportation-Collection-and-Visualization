const Sequelize = require('sequelize');

const modelName = 'OneTimeCommand';
module.exports = sequelize => ({
  modelName,
  associate: ({ OneTimeCommand, Charger }) => {
    OneTimeCommand.belongsTo(Charger);
  },
  model: sequelize
    .define(modelName, {
      command: { type: Sequelize.STRING(30), allowNull: false },
      handled: { type: Sequelize.BOOLEAN, defaultValue: false },
    },
    {
      freezeTableName: true,
      tableName: 'onetimecommand'
    })
});