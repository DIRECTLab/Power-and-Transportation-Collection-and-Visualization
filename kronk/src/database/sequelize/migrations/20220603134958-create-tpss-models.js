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

    await queryInterface.createTable("timestamp", {
      ...shared,
      time: { type: Sequelize.DATE, allowNull: false },
    })

    await queryInterface.createTable("digitalentry", {
      ...shared,
      location: { type: Sequelize.STRING, allowNull: false },
      mnemonic: { type: Sequelize.STRING, allowNull: false },
      value:    { type: Sequelize.INTEGER, allowNull: false },
      TimestampId: {
        type: Sequelize.INTEGER,
        references: {
          model: "timestamp",
          key: 'id',
        },
        onUpdate: 'cascade',
      }
    })

    await queryInterface.createTable("analogentry", {
      ...shared,
      location: { type: Sequelize.STRING, allowNull: false },
      mnemonic: { type: Sequelize.STRING, allowNull: false },
      value:    { type: Sequelize.INTEGER, allowNull: false },
      units:    {type: Sequelize.STRING,  allowNull: false },
      TimestampId: {
        type: Sequelize.INTEGER,
        references: {
          model: "timestamp",
          key: 'id',
        },
        onUpdate: 'cascade',
      }
    })




  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("digitalentry");
    await queryInterface.dropTable("analogentry");
    await queryInterface.dropTable("timestamp");

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
