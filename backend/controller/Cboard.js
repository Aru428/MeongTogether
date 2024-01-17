const { User } = require("../model");
const { Comment } = require("../model");
const { Board } = require("../model");
const path = require("path");

// 게시판 전체 조회
exports.getAllBoard = async (req, res) => {
  try {
    const posts = await Board.findAll({
      where: {
        category: ["일상", "질문", "실종/포착"],
      },
      order: [["board_id", "DESC"]],
    });
    res.send({ result: true, posts: posts });
  } catch (error) {
    console.error("Error getting all posts:", error);
    res.send({ error: "서버 에러" });
  }
};

// 게시판 카테고리별 조회
exports.getBoardCategory = async (req, res) => {
  const category = req.params.category;

  if (!category) {
    return res.send({ error: "카테고리를 제공해주세요." });
  }

  try {
    const posts = await Board.findAll({
      where: {
        category: category,
      },
    });
    res.send({ result: true, posts: posts });
  } catch (error) {
    console.error("Error getting posts by category:", error);
    res.send({ error: "서버 에러" });
  }
};

// 게시판 하나만 조회
exports.getBoardId = async (req, res) => {
  const board_id = req.params.board_id;

  if (!board_id) {
    return res.status(400).send({ error: "게시글 ID를 제공해주세요." });
  }

  try {
    const board = await Board.findOne({
      where: {
        board_id: board_id,
      },
    });

    const user = await User.findOne({ where: { user_id: board.user_id } });

    if (!board) {
      return res.status(404).send({ error: "해당 ID의 게시글이 없습니다." });
    }

    // 조회수 증가
    board.viewcount += 1;
    await board.save();

    res.send({ result: true, board: board, nickname: user.nickname });
  } catch (error) {
    console.error("Error getting board by ID:", error);
    res.status(500).send({ error: "서버 에러" });
  }
};

// 게시글 작성
exports.boardSubmit = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const user_id = req.session.user;
    const image = req.file ? path.join("/static/", req.file.filename) : null;
    if (!user_id) {
      return res.send({
        result: false,
        message: "로그인이 필요한 서비스입니다.",
      });
    }

    // Board 모델을 사용하여 데이터베이스에 저장
    await Board.create({
      user_id,
      title,
      category,
      content,
      image,
      makeboard: Date.now(),
    });

    res.send({ result: true, message: "게시글이 성공적으로 등록되었습니다." });
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 게시글 삭제
exports.boardDelete = async (req, res) => {
  try {
    const board_id = req.params.board_id;
    const user_id = req.session.user;
    if (!user_id) {
      return res.send({
        result: false,
        message: "로그인이 필요한 서비스입니다.",
      });
    }

    const board = await Board.findOne({ where: { board_id: board_id } });

    if (!board) {
      return res.send({
        result: false,
        message: "삭제하려는 게시글이 존재하지 않습니다.",
      });
    }

    if (board.user_id !== user_id) {
      return res.send({
        result: false,
        message: "본인이 작성한 게시글만 삭제할 수 있습니다.",
      });
    }
    await Board.destroy({
      where: {
        board_id: board_id,
      },
    });

    res.send({ result: true, message: "게시글이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 게시글 수정
exports.boardUpdate = async (req, res) => {
  try {
    const board_id = req.params.board_id;
    const { title, category, content } = req.body;
    const user_id = req.session.user;
    const image = req.file ? req.file.filename : null;

    if (!user_id) {
      return res.send({
        result: false,
        message: "로그인이 필요한 서비스입니다.",
      });
    }

    const board = await Board.findOne({ where: { board_id: board_id } });

    if (!board) {
      return res.send({
        result: false,
        message: "수정하려는 게시글이 존재하지 않습니다.",
      });
    }

    if (board.user_id !== user_id) {
      return res.send({
        result: false,
        message: "본인이 작성한 게시글만 수정할 수 있습니다.",
      });
    }
    const updateData = {
      title,
      category,
      content,
    };

    if (image) {
      updateData.image = image;
    }

    await Board.update(updateData, {
      where: {
        board_id: board_id,
      },
    });

    res.send({ result: true, message: "게시글이 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 마이페이지 게시판 조회
exports.userBoardList = async (req, res) => {
  try {
    const boardList = await Board.findAll({
      where: {
        user_id: req.session.user,
        category: ["일상", "질문", "실종/포착"],
      },
      order: [["board_id", "DESC"]],
    });

    res.send(boardList);
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 프로필 게시판 조회
exports.profileBoardList = async (req, res) => {
  try {
    const boardList = await Board.findAll({
      where: {
        user_id: req.params.user_id,
        category: ["일상", "질문", "실종/포착"],
      },
      order: [["board_id", "DESC"]],
    });

    res.send(boardList);
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};
