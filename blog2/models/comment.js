'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER
  }, {});
  Comment.associate = function(models) {
    models.Comment.belongsTo(models.User,{as: 'user', foreignKey: 'user_id'})
  };
  return Comment;
};