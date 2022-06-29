const Sequelize = require('sequelize');

const modelName = 'RouteEntry';
module.exports = sequelize => ({
  modelName,
  associate: ({ Bus, RouteEntry }) => {
    RouteEntry.belongsTo(Bus);
  },
  model: sequelize
    .define(modelName, {
      isActive: { type: Sequelize.STRING, allowNull: false },
      latitude: { type: Sequelize.DECIMAL },
      longitude: { type: Sequelize.DECIMAL },
      lineReference: { type: Sequelize.INTEGER },
      lineName: { type: Sequelize.STRING },
      directionReference: { type: Sequelize.STRING, allowNull: true },
      speed: { type: Sequelize.DECIMAL },
      gpsFixTime: { type: Sequelize.DATE},
      soc: { type: Sequelize.DECIMAL },
      wheelBasedVehicleSpeed: { type: Sequelize.DECIMAL },
      engineSpeed: { type: Sequelize.DECIMAL },
      totalVehicleDistance: { type: Sequelize.DECIMAL },
      instantaneousPower: { type: Sequelize.DECIMAL },
      tripRegenPower: { type: Sequelize.DECIMAL },
      tripMotorEnergyConsumption: { type: Sequelize.DECIMAL },
      averagePowerKw: { type: Sequelize.DECIMAL },
      timeToEmpty: { type: Sequelize.DECIMAL },
      milesToEmpty: { type: Sequelize.DECIMAL },
      averageSpeed: { type: Sequelize.DECIMAL },
      chargingEnergyTransferKwh: { type: Sequelize.DECIMAL },
      dcEnergyConsumptionKwh: { type: Sequelize.DECIMAL },
      auxInverterEnergyConsumptionKwh: { type: Sequelize.DECIMAL },
      electricHeaderEnergyConsumptionKwh: { type: Sequelize.DECIMAL },
      sysInstantaneousEnergyKwh: { type: Sequelize.DECIMAL },
      sysSoc: { type: Sequelize.DECIMAL },
      time: { type: Sequelize.DATE, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'routeEntry',
    }),
});