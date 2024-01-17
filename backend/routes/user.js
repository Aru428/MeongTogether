const express = require("express");
const controller = require("../controller/Cuser");
const router = express.Router();
const { upload } = require("../multer/multerConfig");

// 회원가입
router.post("/signup", upload.single("image"), controller.signUp);
// 로그인
router.post("/signin", controller.signIn);
// 아이디 중복확인
router.post("/checkid", controller.checkId);
// 닉네임 중복확인
router.post("/checknickname", controller.checkNickname);
// 아이디 찾기
router.post("/findid", controller.FindId);
// 비밀번호 변경
router.patch("/updatepassword", controller.updatePassword);
// 닉네임 수정
router.patch("/updatenickname", controller.updateNickname);
// 회원 탈퇴
router.delete("/deleteuser", controller.deleteUser);
// 회원 강아지 정보 입력
router.patch("/updatedoginfo", controller.updateDogInfo);
// 마이페이지 이미지 변경
router.post(
  "/uploadimage",
  upload.single("image"),
  controller.uploadImage,
  (error, req, res, next) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else {
      next();
    }
  }
);
// 로그아웃
router.post("/logout", controller.logout);
// 사용자 정보 조회
router.get("/userprofile/:nickname", controller.userProfile);

module.exports = router;
