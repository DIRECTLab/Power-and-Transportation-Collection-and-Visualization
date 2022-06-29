'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('metervalue', {
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
      timestamp: { type: Sequelize.DATE },
      TransactionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "transaction",
          key: 'id',
        },
        onUpdate: 'cascade',
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('metervalue');
  }
};
