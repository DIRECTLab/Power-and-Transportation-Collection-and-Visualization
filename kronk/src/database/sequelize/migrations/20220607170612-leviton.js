'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('levitonMeter', {
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

    await queryInterface.createTable('levitonEntry', {
      timestamp: { type: Sequelize.DATE, allowNull: false, primaryKey: true, unique: true },
      power: { type: Sequelize.FLOAT, allowNull: false },


      LevitonMeterId: {
        type: Sequelize.STRING,
        references: {
          model: 'levitonMeter',
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
    await queryInterface.dropTable('levitonEntry');
    await queryInterface.dropTable('levitonMeter');
  }
};
