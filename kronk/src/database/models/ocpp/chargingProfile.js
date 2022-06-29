const Sequelize = require('sequelize');

const modelName = 'ChargingProfile';
module.exports = sequelize => ({
  modelName,
  associate: ({ ChargingProfile, Charger }) => {
    ChargingProfile.belongsTo(Charger);
  },
  model: sequelize
    .define(modelName, {
      chargingProfileId: { type: Sequelize.INTEGER },
      stackLevel: { type: Sequelize.INTEGER },
      chargingProfilePurpose: { type: Sequelize.STRING(30) },
      chargingProfileKind: { type: Sequelize.STRING(30) },
      chargingSchedule: { type: Sequelize.JSON },
      connectorId: { type: Sequelize.INTEGER },
      handled: { type: Sequelize.BOOLEAN, defaultValue: false, },
      cleared: { type: Sequelize.BOOLEAN, defaultValue: false, },
    },
    {
      freezeTableName: true,
      tableName: 'chargingprofile'
    })
});
