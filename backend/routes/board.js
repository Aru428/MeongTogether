const express = require("express");
const controller = require("../controller/Cboard");
const router = express.Router();
const { boardupload } = require("../multer/multerConfig");

// 게시판 전체 조회
router.get("/getallboard", controller.getAllBoard);
// 게시판 카테고리 별 조회
router.get("/getboardcategory/:category", controller.getBoardCategory);
// 게시판 하나만 조회
router.get("/getboardid/:board_id", controller.getBoardId);
// 게시판 작성
router.post(
  "/boardsubmit",
  boardupload.single("image"),
  controller.boardSubmit
);
// 게시판 삭제
router.delete("/boarddelete/:board_id", controller.boardDelete);
// 게시판 수정
router.patch(
  "/boardupdate/:board_id",
  boardupload.single("image"),
  controller.boardUpdate
);
// 마이페이지 게시판 조회
router.get("/userboardlist", controller.userBoardList);
// 프로필 게시판 조회
router.get("/profileboardlist/:user_id", controller.profileBoardList);

module.exports = router;
