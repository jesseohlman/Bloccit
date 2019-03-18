'use strict';
module.exports = (sequelize, DataTypes) => {
  const Flair = sequelize.define('Flair', {
    color: {
      type: DataTypes.STRING,
      allowNull: false},
    name: {
      type: DataTypes.STRING,
      allowNull: false},
 /* topicId: {
    type: DataTypes.INTEGER,
    onDelete: "CASCADE",
    references: {
      model: "Topics",
      key: "id",
      as: "topicId",
    }
  }*/
  },{});
  Flair.associate = function(models) {
    // associations can be defined here
    /*Flair.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });*/
  };
  return Flair;
};