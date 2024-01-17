import styles from "./Community.module.scss";
import React, { useState, useEffect } from "react";
import axios from "axios"; // axios 라이브러리 import
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Community() {
  const { community_id } = useParams();
  const [communityData, setCommunityData] = useState(null);
  const [memberList, setMemberList] = useState(null);
  const navigator = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  const { nickname } = useSelector((state) => state.user);
  const [boardList, setBoardList] = useState(null);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    console.log("현재 멤버 리스트", { memberList });
  }, [memberList]);
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);
  const [isBoardModalOpen, setBoardModalOpen] = useState(false);
  // const community_id = 2; // 실제로는 해당 커뮤니티를 조회하기 위한 고유 id값을 사용해야 합니다.

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}/community/getcommunity/${community_id}`
      )
      .then((response) => {
        if (response.data.result) {
          setCommunityData(response.data.data);
        } else {
          console.error("커뮤니티 데이터를 불러오는데 실패하였습니다.");
        }
      })
      .catch((error) => {
        console.error(
          "커뮤니티 데이터를 불러오는 API 호출에 실패하였습니다:",
          error
        );
      });

    axios
      .get(
        `${process.env.REACT_APP_HOST}/board/getboardcategory/${community_id}_자유`
      )
      .then((res) => {
        if (res.data.posts.length > 0) {
          console.log(res.data.posts);
          setBoardList(res.data.posts);
        } else {
          // 글이 없는 경우에 대한 처리
        }
      })
      .catch((error) => {
        console.error(
          "게시판 데이터를 불러오는 API 호출에 실패하였습니다:",
          error
        );
      });
  }, [community_id]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST}/community/getcommunitymembers/${community_id}`
      );
      if (response.data.result) {
        setMemberList(response.data.data);
        console.log(response.data.data);
        // 현재 사용자가 이미 가입된 상태인지 확인
        const joined = response.data.data.some(
          (member) => member.nickname === nickname
        );
        setIsJoined(joined);

        // 추가: 매니저 정보를 불러옵니다.
        const responseManager = await axios.get(
          `${process.env.REACT_APP_HOST}/community/getmanager/${community_id}`
        );
        if (responseManager.data.result) {
          const isManager = responseManager.data.data.manager === nickname;
          setIsManager(isManager);
        } else {
          console.error("매니저 정보를 불러오는데 실패하였습니다.");
        }
      } else {
        console.error("커뮤니티 멤버 데이터를 불러오는데 실패하였습니다.");
      }
    } catch (error) {
      console.error(
        "커뮤니티 멤버 데이터를 불러오는 API 호출에 실패하였습니다:",
        error
      );
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [community_id]);

  const JoinCommunity = () => {
    if (!memberList.includes(nickname)) {
      setMemberList((memberList) => [...memberList, nickname]);
      setIsJoined(true);

      // 서버로 가입 요청 보내기
      axios
        .post(
          `${process.env.REACT_APP_HOST}/community/joincommunity/${community_id}`,
          {},
          {
            withCredentials: true,
          }
        )

        .then((response) => {
          console.log(response.data);
          fetchMembers();
        })
        .catch((error) => {
          console.error(error);
        });
    } else console.log("이미 가입한 모임입니다");
  };

  const LeaveCommunity = () => {
    setMemberList((memberList) =>
      memberList.filter((member) => member !== nickname)
    );
    setIsJoined(false);

    // 서버로 탈퇴 요청 보내기
    axios
      .delete(
        `${process.env.REACT_APP_HOST}/community/leavecommunity/${community_id}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        fetchMembers();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const DeleteCommunity = () => {
    axios
      .delete(
        `${process.env.REACT_APP_HOST}/community/deletecommunity/${community_id}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        alert("모임이 삭제되었습니다.");
        console.log(response);
        fetchMembers();
        navigator(`/communityboard/`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!communityData || !memberList) return <div>Loading...</div>;

  // 커뮤니티 데이터가 로드되지 않았다면 로딩 중임을 표시
  if (!communityData) return <div>Loading...</div>;

  //////////////

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.bg2}>
          {[communityData].map((group, index) => (
            <div key={index}>
              <div className={styles.head}>
                <h1 className={styles.c_main_groupName}>
                  👨‍👩‍👧‍👦 {group.community_local} {group.community_name}
                </h1>
                <div className={styles.buttonHold}>
                  {isJoined && (
                    <div className={styles.button_opentalk}>가입 중</div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className={styles.container}>
            {[communityData].map(
              (
                group,
                index // 변경된 부분
              ) => (
                <>
                  <div key={index}></div>

                  <div className={styles.headSection}>
                    <div className={styles.section}>
                      <h1 className={styles.caption}>소개</h1>
                      <div className={styles.detail}>{group.introduce}</div>
                    </div>

                    <div className={styles.section}>
                      <h1 className={styles.caption}>멤버 목록</h1>


                      {memberList.slice(0, 3).map((member, index) => (
                        <div key={index} className={styles.member}>
                          <div className={styles.flex}>
                            <div>{member.nickname}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${styles.section} ${styles.flex}`}>
                    <div className={`${styles.boardSection}`}>
                      <h1 className={styles.caption}>게시판</h1>
                      <div
                        className={styles.button_board}
                        onClick={() =>
                          navigator(
                            `/communityboard/community/${group.community_id}/communityinnerboard`
                          )
                        }
                      >
                        게시판 더보기
                      </div>
                    </div>

                    {boardList &&
                      boardList.slice(0, 4).map((post, index) => (
                        <div
                          key={index}
                          className={styles.board}
                          onClick={() =>
                            navigator(
                              `/communityboard/community/${
                                group.community_id
                              }/communityinnerboard/communityPage/${index + 1}`
                            )
                          }
                        >
                          <h4>{post.title}</h4>
                          <p>{post.user_id}</p>
                          <p>{post.content}</p>
                        </div>
                      ))}
                  </div>
                  <div className={styles.bottom}>
                    {isManager ? (
                      <div className={styles.flex_m}>
                        <div
                          className={styles.button_manage}
                          onClick={() => {
                            navigator(
                              `/communityboard/makecommunity/${community_id}/update`,
                              { state: { value: { communityData } } }
                            );
                          }}
                        >
                          모임 수정하기
                        </div>
                        <div
                          className={styles.button_delete}
                          onClick={DeleteCommunity}
                        >
                          모임 삭제하기
                        </div>
                      </div>
                    ) : (
                      <div
                        className={styles.button_join}
                        onClick={isJoined ? LeaveCommunity : JoinCommunity}
                        style={{
                          color: isJoined ? "white" : "", // 가입 상태에 따라 글씨 색상 변경
                          border: "2px solid #000000",
                          height: "65px",
                          width: "calc(18%)",
                          borderRadius: "35px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          boxShadow: isJoined ? "" : "1.5px 2px 0px #000000",
                          backgroundColor: isJoined ? "grey" : "#f5ba3f",
                          fontSize: isJoined ? "20px" : "20px", // 가입 상태에 따라 글씨 크기 변경
                        }}
                      >
                        {isJoined ? "탈퇴하기" : "가입하기"}
                      </div>
                    )}
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
