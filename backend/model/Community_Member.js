function Community_Member(Sequelize, DataTypes) {
  return Sequelize.define(
    "Community_Member",
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
      community_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      manager: {
        type: DataTypes.STRING(20),
      },
    },
    {
      tableName: "Community_Member",
      frezzeTableName: true,
      timestamps: false,
    }
  );
}

module.exports = Community_Member;
2;
