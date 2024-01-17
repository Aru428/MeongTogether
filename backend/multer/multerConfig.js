const multer = require("multer");
const path = require("path");

// 업로드된 파일을 저장할 디렉터리 및 파일명 설정
let imageNum = Date();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static"); // 파일을 저장할 디렉터리
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, "user_image__" + imageNum + ext); // 파일명 설정 ex) user_image_1.png
    imageNum++;
  },
});

// 업로드된 파일을 저장할 디렉터리 및 파일명 설정
let boardImageNum = Date();
const storageEditor = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static"); // 파일을 저장할 디렉터리
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, "board_image__" + boardImageNum + ext); // 파일명 설정 ex) user_image_1.png
    boardImageNum++;
  },
});

// 파일 필터 함수 정의 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/png",
  ]; // 허용할 이미지 MIME 타입 목록

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // 허용
  } else {
    cb(new Error("지원하지 않는 파일 형식입니다."), false); // 거부
  }
};

// 프로필 이미지 파일 업로드를 처리할 Multer 인스턴스 생성
const upload = multer({
  storage: storage,
  fileFilter: fileFilter, // 파일 필터 적용
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
// 게시판 이미지 파일 업로드를 처리할 Multer 인스턴스 생성
const boardupload = multer({
  storage: storageEditor,
  fileFilter: fileFilter, // 파일 필터 적용
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = {
  upload,
  boardupload,
};
