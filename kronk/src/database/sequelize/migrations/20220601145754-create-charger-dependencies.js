'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    const shared = {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      }
    };

    await queryInterface.createTable('chargerstatus', {
      ...shared,
      connected: { type: Sequelize.BOOLEAN, allowNull: false },
      statusTime: { type: Sequelize.DATE, allowNull: false },
      status: {type: Sequelize.STRING, defaultValue: 'unknown' },
      ChargerId: {
        type: Sequelize.STRING,
        references: {
          model: "charger",
          key: 'id',
        },
        onUpdate: 'cascade',
      },
    });

    await queryInterface.createTable('chargingprofile', {
      ...shared,
      chargingProfileId: { type: Sequelize.INTEGER },
      stackLevel: { type: Sequelize.INTEGER },
      chargingProfilePurpose: { type: Sequelize.STRING(30) },
      chargingProfileKind: { type: Sequelize.STRING(30) },
      chargingSchedule: { type: Sequelize.JSON },
      connectorId: { type: Sequelize.INTEGER },
      handled: { type: Sequelize.BOOLEAN, defaultValue: false, },
      cleared: { type: Sequelize.BOOLEAN, defaultValue: false, },
      ChargerId: {
        type: Sequelize.STRING,
        references: {
          model: "charger",
          key: 'id',
        },
        onUpdate: 'cascade',
      }
    });

    await queryInterface.createTable('onetimecommand', {
      ...shared,
      command: { type: Sequelize.STRING(30), allowNull: false },
      handled: { type: Sequelize.BOOLEAN, defaultValue: false },
      ChargerId: {
        type: Sequelize.STRING,
        references: {
          model: "charger",
          key: 'id',
        },
        onUpdate: 'cascade',
      }
    });

    await queryInterface.createTable('transaction', {
      ...shared,
      connectorId: { type: Sequelize.INTEGER, allowNull: false },
      meterStart: { type: Sequelize.INTEGER, allowNull: false },
      timestampStart: { type: Sequelize.DATE, allowNull: false },
      meterStop: { type: Sequelize.INTEGER },
      timestampEnd: { type: Sequelize.DATE },
      current: { type: Sequelize.BOOLEAN },
      powerConsumed: { type: Sequelize.INTEGER },
      ChargerId: {
        type: Sequelize.STRING,
        references: {
          model: "charger",
          key: 'id',
        },
        onUpdate: 'cascade',
      }
    });


  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('chargerstatus');
    await queryInterface.dropTable('chargingprofile');
    await queryInterface.dropTable('onetimecommand');
    await queryInterface.dropTable('transaction');
  }
};
