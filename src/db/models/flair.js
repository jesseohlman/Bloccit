'use strict';
module.exports = (sequelize, DataTypes) => {
  const Flair = sequelize.define('Flair', {
    color: {
      type: DataTypes.STRING,
      allowNull: false},
    name: {
      type: DataTypes.STRING,
      allowNull: false},
   postId: {
    type: DataTypes.INTEGER,
    onDelete: "CASCADE",
    references: {
      model: "Posts",
      key: "id",
      as: "postId",
    }
  }
  },{});
  Flair.associate = function(models) {
    // associations can be defined here
    Flair.belongsTo(models.Post, {
      foreignKey: "postId",
      onDelete: "CASCADE"
    });
  };
  return Flair;
};