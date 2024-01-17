function Comment(Sequelize, DataTypes) {
  return Sequelize.define(
    "Comment",
    {
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      board_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      comment_content: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      makecomment: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "Comment",
      frezzeTableName: true,
      timestamps: false,
    }
  );
}

module.exports = Comment;
