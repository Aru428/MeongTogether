const { User } = require("../model");
const crypto = require("crypto");
const path = require("path");

// 회원가입
exports.signUp = (req, res) => {
  const image = req.file ? path.join("/static/", req.file.filename) : null;
  const salt = crypto.randomBytes(16).toString("base64");
  const iterations = 100;
  const keylen = 64;
  const digest = "sha512";
  const hashedPassword = crypto
    .pbkdf2Sync(req.body.password, salt, iterations, keylen, digest)
    .toString("base64");
  const data = {
    user_id: req.body.user_id,
    password: hashedPassword,
    salt: salt,
    nickname: req.body.nickname,
    email: req.body.email,
    image: image,
    dog_name: req.body.dog_name || null,
    dog_intro: req.body.dog_intro || null,
  };
  User.create(data)
    .then((result) => {
      console.log("회원가입 성공");
      res.send({ result: true, message: "회원가입에 성공하였습니다." });
    })
    .catch((error) => {
      console.log("회원가입 실패", error);
      res.send({ result: false, message: "회원가입에 실패하였습니다." });
    });
};

// 로그인
exports.signIn = async (req, res) => {
  const user = await User.findOne({ where: { user_id: req.body.user_id } });

  if (!user) {
    return res.send({ result: false, message: "사용자를 찾을 수 없습니다." });
  }

  const iterations = 100;
  const keylen = 64;
  const digest = "sha512";
  const hashedPassword = crypto
    .pbkdf2Sync(req.body.password, user.salt, iterations, keylen, digest)
    .toString("base64");
  if (user.password === hashedPassword) {
    req.session.user = user.user_id; // 세션에 사용자 아이디 저장
    req.session.isAuthenticated = true; // 로그인 상태를 true로 설정
    console.log("로그인성공");
    res.send({ result: true, user_id: user.user_id, nickname: user.nickname });
  } else {
    console.log("로그인실패");
    res.send({ result: false, message: "비밀번호가 일치하지 않습니다." });
  }
};

// 아이디 중복확인
exports.checkId = (req, res) => {
  User.findAll({
    where: {
      user_id: req.body.user_id,
    },
  }).then((result) => {
    if (result.length > 0) {
      // 이미 사용 중인 아이디가 있음
      res.send({ duplicate: true });
    } else {
      // 사용 가능한 아이디
      res.send({ duplicate: false });
    }
  });
};
// 닉네임 중복확인
exports.checkNickname = (req, res) => {
  User.findAll({
    where: {
      nickname: req.body.nickname,
    },
  }).then((result) => {
    if (result.length > 0) {
      // 이미 사용 중인 닉네임이 있음
      res.send({ duplicate: true });
    } else {
      // 사용 가능한 닉네임
      res.send({ duplicate: false });
    }
  });
};
// 아이디 찾기
exports.FindId = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((result) => {
    if (result) {
      // 해당 이메일로 등록된 아이디가 있으면 userid를 반환
      res.send({ user_id: result.user_id });
    } else {
      // 해당 이메일로 등록된 아이디가 없으면 userid: null
      res.send({ user_id: null });
    }
  });
};

// 비밀번호 변경
exports.updatePassword = async (req, res) => {
  const user = await User.findOne({ where: { user_id: req.session.user } });

  if (!user) {
    return res.send({ result: false, message: "유저를 찾을 수 없습니다." });
  }

  const salt = crypto.randomBytes(16).toString("base64");
  const iterations = 100;
  const keylen = 64;
  const digest = "sha512";
  const hashedPassword = crypto
    .pbkdf2Sync(req.body.password, salt, iterations, keylen, digest)
    .toString("base64");
  // 변경된 정보 저장
  const data = {
    password: hashedPassword,
    salt: salt,
  };
  User.update(data, {
    where: {
      user_id: req.session.user,
    },
  }).then((result) => {
    if (result) {
      res.send({
        result: true,
        message: "비밀번호가 성공적으로 변경되었습니다.",
        isAuthenticated: req.session.isAuthenticated,
      });
    } else res.send({ result: false });
  });
};

// 닉네임 변경
exports.updateNickname = (req, res) => {
  const data = { nickname: req.body.nickname };

  User.update(data, {
    where: {
      user_id: req.session.user,
    },
  }).then((result) => {
    if (result) {
      res.send({
        result: true,
        message: "닉네임이 성공적으로 수정되었습니다.",
      });
    } else res.send({ result: false });
  });
};

// 회원 탈퇴
exports.deleteUser = (req, res) => {
  User.findOne({ where: { user_id: req.session.user } }).then((row) => {
    if (row) {
      const hashedPassword = crypto
        .pbkdf2Sync(req.body.password, row.salt, 100, 64, "sha512")
        .toString("base64");
      if (row.password === hashedPassword) {
        User.destroy({
          where: { user_id: req.session.user },
        }).then((result) => {
          if (result) {
            req.session.destroy((err) => {
              if (err) throw err;
              res.send({ result: true });
            });
          } else res.send({ result: false });
        });
      }
    } else res.send({ result: false });
  });
};

// 회원 강아지 정보 입력
exports.updateDogInfo = (req, res) => {
  const data = {
    dog_name: req.body.dog_name || null,
    dog_intro: req.body.dog_intro || null,
  };

  User.update(data, {
    where: {
      user_id: req.session.user,
    },
  }).then((result) => {
    if (result) {
      res.send({
        result: true,
        message: "정보가 수정되었습니다.",
      });
    } else res.send({ result: false });
  });
};

exports.uploadImage = (req, res) => {
  const data = {
    image: path.join("/static/", req.file.filename),
  };

  User.update(data, {
    where: {
      user_id: req.session.user,
    },
  }).then((result) => {
    if (result) {
      res.send({
        result: true,
        message: "이미지가 수정되었습니다.",
      });
    } else res.send({ result: false });
  });
};

// 로그아웃
exports.logout = (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) throw err;
      res.send({ result: true, message: "로그아웃에 성공하였습니다." });
    });
  } else {
    res.send({ result: false, message: "로그아웃에 실패하였습니다." });
  }
};

// 사용자 정보 조회
exports.userProfile = async (req, res) => {
  try {
    const profile = await User.findOne({
      attributes: ["user_id", "nickname", "image", "dog_name", "dog_intro"],
      where: { nickname: req.params.nickname },
    });

    if (!profile.image) profile.image = "/static/user-profile.jpg";

    res.send(profile);
  } catch (err) {
    console.log(err);
    res.send({ result: false, message: "서버 오류입니다." });
  }
};
