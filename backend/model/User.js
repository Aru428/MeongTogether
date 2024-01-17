function User(Sequelize, DataTypes) {
  return Sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(500),
      },
      dog_name: {
        type: DataTypes.STRING(20),
      },
      dog_gender: {
        type: DataTypes.STRING(10),
      },
      dog_age: {
        type: DataTypes.INTEGER,
      },
      dog_intro: {
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: "User",
      frezzeTableName: true,
      timestamps: false,
    }
  );
}

module.exports = User;
