'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Comments', 'post_id', { type: Sequelize.INTEGER, 
      references: { model: {tableName: 'Posts'}, key: 'id' },
      allowNull: false });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Comments', 'post_id');
  }
};
