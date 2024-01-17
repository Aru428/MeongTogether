const { User, Chat_Room, Chat_Member, Message } = require("../model");
const Sequelize = require("sequelize");

// 채팅방 생성
exports.createChatRoom = async (req, res) => {
  try {
    const { chat_name, chat_category, user_id } = req.body;

    // 채팅방 이름 중복확인
    let existingRoom = await Chat_Room.findOne({
      where: { chat_name: chat_name },
    });

    if (!existingRoom) {
      // 존재하지 않을 때만 정렬된 이름으로 다시 확인
      const sortedChatName = chat_name.split("&").sort().join("&");

      existingRoom = await Chat_Room.findOne({
        where: { chat_name: sortedChatName },
      });
    }

    if (existingRoom) {
      return res.send({
        result: false,
        msg: "이미 존재하는 방이다.",
        chat_name: existingRoom.chat_name,
        chat_id: existingRoom.chat_id,
      });
    } else {
      const createdChatRoom = await Chat_Room.create({
        chat_name: chat_name,
        chat_category: chat_category,
      });

      // 로그인 한 유저
      await Chat_Member.create({
        user_id: req.session.user,
        chat_id: createdChatRoom.chat_id,
      });

      // 상대(쪽지 보내는 유저)
      await Chat_Member.create({
        user_id: req.body.user_id,
        chat_id: createdChatRoom.chat_id,
      });

      res.send({
        result: true,
        message: "채팅방이 성공적으로 생성되었습니다.",
        chat_name: createdChatRoom.chat_name,
        chat_id: createdChatRoom.chat_id,
      });
    }
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 채팅방 입장
exports.entryChatRoom = async (req, res) => {
  try {
    const entryChatRoom = await Chat_Room.findOne({
      where: { chat_name: req.body.chat_name },
    });

    await Chat_Member.create({
      user_id: req.session.user,
      chat_id: entryChatRoom.chat_id,
    });

    res.send({
      result: true,
      message: `${req.session.user}님이 입장했습니다.`,
    });
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 채팅방 나가기
exports.exitChatRoom = async (req, res) => {
  try {
    const chatRoom = await Chat_Room.findOne({
      where: { chat_name: req.body.chat_name },
    });

    await Chat_Member.destroy({
      where: { user_id: req.session.user, chat_id: chatRoom.chat_id },
    });

    res.send({
      result: true,
      message: `${req.session.user}님이 채팅방을 나가셨습니다.`,
    });
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 채팅방 삭제
exports.deleteChatRoom = async (req, res) => {
  try {
    await Chat_Room.destroy({ where: { chat_name: req.body.chat_name } });

    res.send({
      result: true,
      message: "채팅방이 삭제되었습니다.",
    });
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 채팅방 조회
exports.ChatRoomList = async (req, res) => {
  try {
    const userJoinChat = await Chat_Member.findAll({
      where: { user_id: req.session.user },
    });

    let chatRoomId = [];
    for (let chat of userJoinChat) {
      chatRoomId.push(chat.chat_id);
    }

    const chatRoomList = await Chat_Room.findAll({
      where: { chat_id: chatRoomId, chat_category: "dm" },
      attributes: [
        "chat_id",
        "chat_name",
        [
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("chat_time"),
            "%Y-%m-%d %H:%i:%s"
          ),
          "chat_time",
        ],
      ],
    });

    res.send(chatRoomList);
  } catch (error) {
    console.log(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 채팅메세지 생성
exports.createMsg = async (req, res) => {
  try {
    const { chat_name, msg_content } = req.body;
    const chatRoom = await Chat_Room.findOne({
      where: { chat_name: chat_name },
    });

    await Message.create({
      user_id: req.body.user_id,
      chat_id: chatRoom.chat_id,
      msg_content: msg_content,
    });

    res.send({ result: true });
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 채팅메세지 조회
exports.getAllMsg = async (req, res) => {
  try {
    const chatRoom = await Chat_Room.findOne({
      where: { chat_name: req.params.chat_name },
    });

    const dm = await Message.findAll({
      where: { chat_id: chatRoom.chat_id },
      attributes: [
        "user_id",
        "msg_content",
        [
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("send_time"),
            "%Y-%m-%d %H:%i:%s"
          ),
          "send_time",
        ],
      ],
    });

    res.send(dm);
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};
