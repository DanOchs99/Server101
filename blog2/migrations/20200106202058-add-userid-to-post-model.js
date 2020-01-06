'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Posts', 'user_id', { type: Sequelize.INTEGER, 
          references: { model: {tableName: 'Users'}, key: 'id' },
          allowNull: false })
        },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Posts', 'user_id');
  }
};
