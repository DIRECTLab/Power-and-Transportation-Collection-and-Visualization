'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('chargepoint', {
      id: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true },


      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    
    await queryInterface.createTable('chargepointEntry', {
      id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, unique: true, autoIncrement: true },
      portNumber: { type: Sequelize.INTEGER },
      status: { type: Sequelize.STRING },
      timestamp: { type: Sequelize.DATE },

      ChargepointId: {
        type: Sequelize.STRING,
        references: {
          model: 'chargepoint',
          key: 'id'
        },
        onUpdate: 'cascade'
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
    await queryInterface.dropTable('chargepointEntry');
    await queryInterface.dropTable('chargepoint');
  }
};
