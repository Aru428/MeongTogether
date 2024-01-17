const express = require("express");
const controller = require("../controller/Ccommunity");
const router = express.Router();

// 게시판의 소모임 카테고리 불러오는 함수
router.get("/getcommunityboard", controller.getCommunityBoard);
// 지역별 소모임 검색
router.get("/searchlocal/:local", controller.searchLocal);
// 소모임 하나만 조회
router.get("/getcommunity/:community_id", controller.getCommunity);
// 소모임 전체 조회
router.get("/getcommunities", controller.getCommunities);
// 사용자가 참여한 소모임 조회
router.get("/getusercommunity", controller.getUserCommunity);
// 소모임 참여자 목록 조회
router.get(
  "/getcommunitymembers/:community_id",
  controller.getCommunityMembers
);
// 소모임 매니저 조회
router.get("/getmanager/:community_id", controller.getManager);
// 소모임 생성
router.post("/createcommunity", controller.createCommunity);
// 소모임 참여
router.post("/joincommunity/:community_id", controller.joinCommunity);
// 소모임 나가기
router.delete("/leavecommunity/:community_id", controller.leaveCommunity);
// 소모임 수정
router.patch("/updatecommunity/:community_id", controller.updateCommunity);
// 소모임 삭제
router.delete("/deletecommunity/:community_id", controller.deleteCommunity);

module.exports = router;
