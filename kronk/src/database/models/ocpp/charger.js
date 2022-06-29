const Sequelize = require('sequelize');

const modelName = 'Charger';
module.exports = sequelize => ({
  modelName,
  associate: ({ Charger, ChargerStatus, ChargingProfile, Transaction, OneTimeCommand, Location }) => {
    Charger.hasMany(ChargerStatus);
    Charger.hasMany(ChargingProfile);
    Charger.hasMany(Transaction);
    Charger.hasMany(OneTimeCommand);
    Charger.belongsTo(Location);
  },
  model: sequelize
    .define(modelName, {
      id: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
      chargerName: { type: Sequelize.STRING },
    },
    {
      freezeTableName: true,
      tableName: 'charger',
    }),
});