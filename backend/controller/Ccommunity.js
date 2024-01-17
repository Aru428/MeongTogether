const { User } = require("../model");
const { Board } = require("../model");
const { Community } = require("../model");
const { Community_Member } = require("../model");

// 게시판의 소모임 카테고리 불러오기
exports.getCommunityBoard = async (req, res) => {
  try {
    const boards = await Board.findAll({
      where: {
        category: "소모임",
      },
    });

    if (!boards) {
      return res.send({ result: false, message: "게시판이 없습니다." });
    }

    res.status(200).send({ boards });
  } catch (error) {
    console.error("Error getting boards:", error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 지역별 소모임 검색
exports.searchLocal = async (req, res) => {
  const { local } = req.params;

  try {
    const communities = await Community.findAll({
      where: {
        community_local: local,
      },
    });

    if (!communities.length) {
      return res.send({
        result: false,
        message: "해당 지역의 소모임이 없습니다.",
      });
    }

    res.send({ communities });
  } catch (error) {
    console.error("Error searching communities:", error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 소모임 하나 조회
exports.getCommunity = async (req, res) => {
  try {
    const { community_id } = req.params;

    const community = await Community.findOne({
      where: { community_id: community_id },
    });

    if (!community) {
      return res.send({
        result: false,
        message: "존재하지 않는 소모임입니다.",
      });
    }

    res.send({ result: true, data: community });
  } catch (error) {
    console.error("Error getting community:", error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 소모임 전체 조회
exports.getCommunities = async (req, res) => {
  try {
    const communities = await Community.findAll();

    res.send({ result: true, data: communities });
  } catch (error) {
    console.error("Error getting all communities:", error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 소모임 참여자 목록 조회
exports.getCommunityMembers = async (req, res) => {
  try {
    const { community_id } = req.params;

    const communityMembers = await Community_Member.findAll({
      where: { community_id: community_id },
    });

    if (!communityMembers) {
      return res.send({
        result: false,
        message: "존재하지 않는 소모임이거나 참여자가 없습니다.",
      });
    }

    const users = [];
    for (let member of communityMembers) {
      const user = await User.findOne({
        where: { user_id: member.user_id },
        attributes: ["nickname", "image"],
      });
      users.push(user);
    }

    res.send({ result: true, data: users });
  } catch (error) {
    console.error("Error getting community members:", error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 소모임 매니저 조회
exports.getManager = async (req, res) => {
  try {
    const community_id = req.params.community_id;

    // 커뮤니티 매니저 조회
    const manager = await Community_Member.findOne({
      where: { community_id: community_id },
      attributes: ["manager"],
    });

    if (!manager) {
      return res.send({
        result: false,
        message: "해당 소모임의 매니저가 존재하지 않습니다.",
      });
    } else {
      return res.send({
        result: true,
        message: "매니저 정보 조회에 성공하였습니다.",
        data: manager,
      });
    }
  } catch (error) {
    console.error("Error getting manager:", error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 소모임 생성
exports.createCommunity = async (req, res) => {
  try {
    const { community_name, community_local, introduce } = req.body;

    const newCommunity = await Community.create({
      community_name: community_name,
      community_local: community_local,
      introduce: introduce,
    });

    await Community_Member.create({
      user_id: req.session.user,
      community_id: newCommunity.community_id,
      manager: req.session.user,
    });

    res.send({ result: true, message: "소모임이 성공적으로 생성되었습니다." });
  } catch (error) {
    console.error("Error creating community:", error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 소모임 참여
exports.joinCommunity = async (req, res) => {
  try {
    const community_id = req.params.community_id;

    const community = await Community.findOne({
      where: { community_id: community_id },
    });

    if (!community) {
      return res.send({
        result: false,
        message: "존재하지 않는 소모임입니다.",
      });
    }

    // 사용자 세션 확인
    if (!req.session || !req.session.user) {
      return res.send({
        result: false,
        message: "세션 정보가 없습니다.",
      });
    }

    // 사용자가 이미 소모임에 가입했는지 확인
    const existingMember = await Community_Member.findOne({
      where: {
        user_id: req.session.user,
        community_id: community.community_id,
      },
    });

    if (existingMember) {
      return res.send({
        result: false,
        message: "이미 소모임에 가입하셨습니다.",
      });
    }

    await Community_Member.create({
      user_id: req.session.user,
      community_id: community.community_id,
    });

    res.send({ result: true, message: "소모임에 성공적으로 참여하였습니다." });
  } catch (error) {
    console.error("Error joining community:", error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 소모임 나가기
exports.leaveCommunity = async (req, res) => {
  try {
    const { community_id } = req.params;
    const user_id = req.session.user;

    if (!user_id) {
      return res.send({
        result: false,
        message: "로그인이 필요한 서비스입니다.",
      });
    }

    const membership = await Community_Member.findOne({
      where: { community_id: community_id, user_id: user_id },
    });

    if (!membership) {
      return res.send({
        result: false,
        message: "해당 소모임에 가입하지 않았습니다.",
      });
    }

    // 매니저는 소모임을 나갈 수 없습니다.
    if (membership.manager === user_id) {
      return res.send({
        result: false,
        message: "매니저는 소모임을 나갈 수 없습니다.",
      });
    }

    await membership.destroy();

    res.send({ result: true, message: "소모임에서 성공적으로 나갔습니다." });
  } catch (error) {
    console.error("Error leaving community:", error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 소모임 수정
exports.updateCommunity = async (req, res) => {
  try {
    const { community_name, community_local, introduce } = req.body;
    const community_id = req.params.community_id;

    const communityMember = await Community_Member.findOne({
      where: {
        community_id: community_id,
        manager: req.session.user,
      },
    });

    if (!communityMember) {
      return res.send({
        result: false,
        message: "소모임을 수정할 권한이 없습니다.",
      });
    }

    await Community.update(
      {
        community_name: community_name,
        community_local: community_local,
        introduce: introduce,
      },
      {
        where: { community_id: community_id },
      }
    );

    res.send({ result: true, message: "소모임이 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("Error updating community:", error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 소모임 삭제
exports.deleteCommunity = async (req, res) => {
  try {
    const community_id = req.params.community_id;

    const communityMember = await Community_Member.findOne({
      where: {
        community_id: community_id,
        manager: req.session.user,
      },
    });

    if (!communityMember) {
      return res.send({
        result: false,
        message: "소모임을 삭제할 권한이 없습니다.",
      });
    }

    await Community.destroy({
      where: { community_id: community_id },
    });

    res.send({ result: true, message: "소모임이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("Error deleting community:", error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};

// 사용자가 참여한 소모임 조회
exports.getUserCommunity = async (req, res) => {
  try {
    const communityJoin = await Community_Member.findAll({
      where: { user_id: req.session.user },
    });

    let communityId = [];
    for (let community of communityJoin) {
      communityId.push(community.community_id);
    }

    const communityList = await Community.findAll({
      where: { community_id: communityId },
    });

    res.send(communityList);
  } catch (error) {
    console.log(error);
    res.send({ result: false, message: "서버 오류 발생" });
  }
};
