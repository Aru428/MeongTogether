const Sequelize = require("sequelize");
const config = require("../config/config.json")["development"];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  { ...config, timezone: "Etc/GMT-9" }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./User")(sequelize, Sequelize);
db.Board = require("./Board")(sequelize, Sequelize);
db.Comment = require("./Comment")(sequelize, Sequelize);
db.Chat_Room = require("./Chat_Room")(sequelize, Sequelize);
db.Chat_Member = require("./Chat_Member")(sequelize, Sequelize);
db.Message = require("./Message")(sequelize, Sequelize);
db.Community = require("./Community")(sequelize, Sequelize);
db.Community_Member = require("./Community_Member")(sequelize, Sequelize);

// 게시판 관련 join
db.User.hasMany(db.Board, {
  foreignKey: "user_id",
});
db.Board.belongsTo(db.User, {
  ondelete: "cascade",
  foreignKey: "user_id",
});

// 소모임 관련 join
db.User.hasMany(db.Community_Member, {
  foreignKey: "user_id",
});
db.Community_Member.belongsTo(db.User, {
  ondelete: "cascade",
  foreignKey: "user_id",
});
db.Community.hasMany(db.Community_Member, {
  foreignKey: "community_id",
});
db.Community_Member.belongsTo(db.Community, {
  ondelete: "cascade",
  foreignKey: "community_id",
});

// 댓글 관련 join
db.Board.hasMany(db.Comment, {
  foreignKey: "board_id",
});
db.Comment.belongsTo(db.Board, {
  ondelete: "cascade",
  foreignKey: "board_id",
});
db.User.hasMany(db.Comment, {
  foreignKey: "user_id",
});
db.Comment.belongsTo(db.User, {
  ondelete: "cascade",
  foreignKey: "user_id",
});

// 채팅 참여 관련 join
db.User.hasMany(db.Chat_Member, {
  foreignKey: "user_id",
});
db.Chat_Member.belongsTo(db.User, {
  ondelete: "cascade",
  foreignKey: "user_id",
});
db.Chat_Room.hasMany(db.Chat_Member, {
  foreignKey: "chat_id",
});
db.Chat_Member.belongsTo(db.Chat_Room, {
  ondelete: "cascade",
  foreignKey: "chat_id",
});

// 채팅메세지 관련 join
db.User.hasMany(db.Message, {
  foreignKey: "user_id",
});
db.Message.belongsTo(db.User, {
  ondelete: "cascade",
  foreignKey: "user_id",
});
db.Chat_Room.hasMany(db.Message, {
  foreignKey: "chat_id",
});
db.Message.belongsTo(db.Chat_Room, {
  ondelete: "cascade",
  foreignKey: "chat_id",
});

module.exports = db;
