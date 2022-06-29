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

    await queryInterface.createTable('location', {
      ...shared,
      name: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'Un-named location' },
    });

    await queryInterface.addColumn('charger', 'LocationId', {
      type: Sequelize.INTEGER,
      references: {
        model: "location",
        key: 'id',
      },
      onUpdate: 'set default',
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('charger', 'LocationId');
    await queryInterface.dropTable('location');

  }
};
