const Sequelize = require('sequelize');

const modelName = 'AnalogEntry';
module.exports = sequelize => ({
  modelName,
  associate: ({ AnalogEntry, Timestamp }) => {
    AnalogEntry.belongsTo(Timestamp);
  },
  model: sequelize
    .define(modelName, {
        location: {type: Sequelize.STRING,  allowNull: false },
        mnemonic: {type: Sequelize.STRING,  allowNull: false },
        value:    {type: Sequelize.INTEGER, allowNull: false },
        units:    {type: Sequelize.STRING,  allowNull: false }
    },
    {
      freezeTableName: true,
      tableName: 'analogentry',
    }),
});