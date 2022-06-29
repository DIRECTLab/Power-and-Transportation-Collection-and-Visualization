'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("charger", {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      id: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
      chargerName: { type: Sequelize.STRING },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("charger");
  }
};
