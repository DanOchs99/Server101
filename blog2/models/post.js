'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    category: DataTypes.STRING,
    isPublished: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER
  }, {});
  Post.associate = function(models) {
    // define associations here
  };
  return Post;
};