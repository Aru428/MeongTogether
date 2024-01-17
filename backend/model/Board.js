function Board(Sequelize, DataTypes) {
  return Sequelize.define(
    "Board",
    {
      board_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(500),
      },
      makeboard: {
        type: DataTypes.DATE,
      },
      viewcount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "Board",
      frezzeTableName: true,
      timestamps: false,
    }
  );
}

module.exports = Board;
