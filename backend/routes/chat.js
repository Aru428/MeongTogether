const express = require("express");
const controller = require("../controller/Cchat");
const router = express.Router();

// 채팅방 생성
router.post("/createroom", controller.createChatRoom);
// 채팅방 입장
router.post("/entryroom", controller.entryChatRoom);
// 채팅방 나가기
router.delete("/exitroom", controller.exitChatRoom);
// 채팅방 삭제
router.delete("/deleteroom", controller.deleteChatRoom);
// 채팅방 조회
router.get("/getchatroom", controller.ChatRoomList);
// 채팅메세지 생성
router.post("/createmsg", controller.createMsg);
// 채팅메세지 조회
router.get("/getmsg/:chat_name", controller.getAllMsg);

module.exports = router;
