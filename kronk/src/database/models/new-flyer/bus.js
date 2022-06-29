const Sequelize = require('sequelize');

const modelName = 'Bus';
module.exports = sequelize => ({
  modelName,
  associate: ({ Bus, RouteEntry }) => {
    Bus.hasMany(RouteEntry);
  },
  model: sequelize
    .define(modelName, {
      id: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true },
    },
    {
      freezeTableName: true,
      tableName: 'bus',
    }),
});