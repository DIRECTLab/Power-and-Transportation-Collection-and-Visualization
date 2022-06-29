'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   



    await queryInterface.createTable('bus', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });


    await queryInterface.createTable('routeEntry', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      
      isActive: { type: Sequelize.STRING, allowNull: false },
      latitude: { type: Sequelize.DECIMAL, allowNull: true },
      longitude: { type: Sequelize.DECIMAL, allowNull: true },
      lineReference: { type: Sequelize.INTEGER, allowNull: true },
      lineName: { type: Sequelize.STRING, allowNull: true },
      directionReference: { type: Sequelize.STRING, allowNull: true },
      speed: { type: Sequelize.DECIMAL, allowNull: true },
      gpsFixTime: { type: Sequelize.DATE, allowNull: true},
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

      BusId: {
        type: Sequelize.STRING,
        references: {
          model: 'bus',
          key: 'id',
        },
        onUpdate: 'cascade',
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('routeEntry');
    await queryInterface.dropTable('bus');
  }
};
