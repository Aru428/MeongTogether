function Chat_Member(Sequelize, DataTypes) {
  return Sequelize.define(
    "Chat_Member",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Chat_Member",
      frezzeTableName: true,
      timestamps: false,
    }
  );
}

module.exports = Chat_Member;
