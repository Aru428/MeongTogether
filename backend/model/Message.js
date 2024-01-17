function Message(Sequelize, DataTypes) {
  return Sequelize.define(
    "Message",
    {
      msg_id: {
        type: DataTypes.BIGINT,
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
      msg_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      send_time: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      msg_check: {
        type: DataTypes.STRING(10),
      },
    },
    {
      tableName: "Message",
      frezzeTableName: true,
      timestamps: false,
    }
  );
}

module.exports = Message;
