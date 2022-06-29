'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('sampledvalue', {
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
      },
      value: { type: Sequelize.STRING(50) },
      context: { type: Sequelize.STRING(20) },
      valueFormat: { type: Sequelize.STRING(14) },
      measurand: { type: Sequelize.STRING(40) },
      location: { type: Sequelize.STRING(10) },
      unit: { type: Sequelize.STRING(15) },
      MeterValueId: {
        type: Sequelize.INTEGER,
        references: {
          model: "metervalue",
          key: 'id',
        },
        onUpdate: 'cascade',
      }
    });

    
    // This is to help search times
    // await queryInterface.addIndex('chargerstatus', ['charger']);
    // await queryInterface.addIndex('chargingprofile', ['charger']);
    // await queryInterface.addIndex('onetimecommand', ['charger']);
    // await queryInterface.addIndex('transaction', ['charger']);
    // await queryInterface.addIndex('metervalue', ['transaction']);
    // await queryInterface.addIndex('sampledvalue', ['metervalue']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('sampledvalue');
  }
};
