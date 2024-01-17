const express = require("express");
const controller = require("../controller/Cgetanimal");
const router = express.Router();

// 유기동물 api 불러오기
router.get("/getapi", controller.getApiAnimal);

module.exports = router;
