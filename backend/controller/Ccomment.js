const { User } = require("../model");
const { Comment } = require("../model");
const { Board } = require("../model");

// 댓글 전체 조회
exports.getAllComment = (req, res) => {
  Comment.findAll({
    where: {
      board_id: req.params.board_id,
    },
    // 필요 없으면 삭제해도됨
    include: [
      {
        model: User,
        attributes: ["nickname"],
      },
    ],
  })
    .then((comments) => {
      res.send({ result: true, comments });
    })
    .catch((error) => {
      console.error("Error getting all comments:", error);
      res.send({ result: false, message: "댓글 조회 실패" });
    });
};

// 댓글 하나 조회
exports.getComment = (req, res) => {
  Comment.findOne({
    where: {
      comment_id: req.params.comment_id,
    },
    include: [
      {
        model: User,
        attributes: ["nickname"],
      },
    ],
  })
    .then((comment) => {
      if (comment) {
        res.send({ result: true, comment });
      } else {
        res.send({ result: false, message: "해당 댓글이 존재하지 않습니다." });
      }
    })
    .catch((error) => {
      console.error("Error getting comment:", error);
      res.send({ result: false, message: "댓글 조회 실패" });
    });
};

// 사용자가 작성한 댓글 조회
exports.getUserComment = (req, res) => {
  const user_id = req.session.user;

  Comment.findAll({
    where: {
      user_id: user_id,
    },
    include: [
      {
        model: Board,
        attributes: ["title", "category"],
        where: {
          category: ["일상", "질문", "실종/포착"],
        },
      },
    ],
    order: [["comment_id", "DESC"]],
  })
    .then((comments) => {
      res.send({ result: true, comments });
    })
    .catch((error) => {
      console.error("Error getting user comments:", error);
      res.send({ result: false, message: "댓글 조회 실패" });
    });
};

// 댓글 작성
exports.postComment = async (req, res) => {
  const user_id = req.session.user; // 세션에서 사용자 ID 추출
  const board_id = req.params.board_id;
  console.log(user_id);
  if (!user_id) {
    res.send({ result: false, message: "로그인 후 이용 가능합니다." });
    return;
  }

  const data = {
    board_id: board_id,
    user_id: user_id,
    comment_content: req.body.comment_content,
    makecomment: Date.now(),
  };

  try {
    await Comment.create(data);
    res.send({ result: true, message: "댓글 작성 성공" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.send({ result: false, message: "댓글 작성 실패" });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    const comment_id = req.params.comment_id;
    const user_id = req.session.user;
    console.log(comment_id, user_id);

    if (!user_id) {
      return res.send({
        result: false,
        message: "로그인이 필요한 서비스입니다.",
      });
    }

    const comment = await Comment.findOne({
      where: { comment_id: comment_id },
    });

    if (!comment) {
      return res.send({
        result: false,
        message: "삭제하려는 댓글이 존재하지 않습니다.",
      });
    }

    if (comment.user_id !== user_id) {
      return res.send({
        result: false,
        message: "본인이 작성한 댓글만 삭제할 수 있습니다.",
      });
    }

    await Comment.destroy({
      where: {
        comment_id: comment_id,
      },
    });

    res.send({ result: true, message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 댓글 수정
exports.editComment = async (req, res) => {
  try {
    const comment_id = req.params.comment_id;
    const user_id = req.session.user;
    const comment_content = req.body.comment_content;

    if (!user_id) {
      return res.send({
        result: false,
        message: "로그인이 필요한 서비스입니다.",
      });
    }

    const comment = await Comment.findOne({
      where: { comment_id: comment_id },
    });

    if (!comment) {
      return res.send({
        result: false,
        message: "수정하려는 댓글이 존재하지 않습니다.",
      });
    }

    if (comment.user_id !== user_id) {
      return res.send({
        result: false,
        message: "본인이 작성한 댓글만 수정할 수 있습니다.",
      });
    }
    await Comment.update(
      {
        comment_content,
      },
      {
        where: {
          comment_id: comment_id,
        },
      }
    );

    res.send({ result: true, message: "댓글이 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};
