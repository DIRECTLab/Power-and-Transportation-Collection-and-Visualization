const Sequelize = require('sequelize');

const modelName = 'DigitalEntry';
module.exports = sequelize => ({
  modelName,
  associate: ({ DigitalEntry, Timestamp }) => {
    DigitalEntry.belongsTo(Timestamp);
  },
  model: sequelize
    .define(modelName, {
        location: { type: Sequelize.STRING, allowNull: false },
        mnemonic: { type: Sequelize.STRING, allowNull: false },
        value:    { type: Sequelize.INTEGER, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'digitalentry',
    }),
});