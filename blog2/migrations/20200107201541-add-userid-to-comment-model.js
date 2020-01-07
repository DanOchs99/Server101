'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Comments', 'user_id', { type: Sequelize.INTEGER, 
      references: { model: {tableName: 'Users'}, key: 'id' },
      allowNull: false });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Comments', 'user_id');
  }
};
