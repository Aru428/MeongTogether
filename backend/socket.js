module.exports = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  let user = {};

  io.on("connection", (socket) => {
    console.log("socket id", socket.id);

    // 채팅방 입장
    socket.on("entry", (res) => {
      console.log("채팅방 입장", res);
      const { chat_name, chat_category, nickname } = res;
      user = { chat_name: chat_name, nickname: nickname };

      socket.join(chat_name);
      io.to(chat_name).emit("notice", {
        msg: `${nickname}님이 입장하셨습니다.`,
      });
    });

    // 채팅방 나가기
    socket.on("disconnect", () => {
      console.log("채팅방 나가기", user);
      io.to(user.chat_name).emit("notice", {
        msg: `${user.nickname}님이 퇴장하셨습니다.`,
      });
      socket.leave(user.chat_name);
    });

    // 채팅메세지
    socket.on("sendMsg", (res) => {
      console.log("채팅메세지 보내기", res);
      io.to(user.chat_name).emit("chat", {
        user_id: res.user_id,
        msg: res.msg,
      });
    });
  });
};
