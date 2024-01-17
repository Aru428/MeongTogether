function Chat_Room(Sequelize, DataTypes) {
  return Sequelize.define(
    "Chat_Room",
    {
      chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      chat_name: {
        type: DataTypes.STRING(100),
      },
      chat_time: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      chat_category: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
    },
    {
      tableName: "Chat_Room",
      frezzeTableName: true,
      timestamps: false,
    }
  );
}

module.exports = Chat_Room;
