function Community(Sequelize, DataTypes) {
  return Sequelize.define(
    "Community",
    {
      community_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      community_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      community_local: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      introduce: {
        type: DataTypes.STRING(300),
      },
    },
    {
      tableName: "Community",
      frezzeTableName: true,
      timestamps: false,
    }
  );
}

module.exports = Community;
