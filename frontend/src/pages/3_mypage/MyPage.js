import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserEditModal from "./UserEditModal";
import styles from "./MyPage.module.scss";

export default function MyPage() {
  const [showWriteTable, setShowWriteTable] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [userBoard, setUserBoard] = useState([]);
  const [userChat, setUserChat] = useState([]);
  const [userComment, setUserComment] = useState([]);
  const [userCommunity, setUserCommunity] = useState({});
  const { nickname } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return showWriteTable
      ? userBoard.slice(startIndex, endIndex)
      : userComment.slice(startIndex, endIndex);
  };

  const getUserProfile = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}/user/userprofile/${nickname}`)
      .then((res) => {
        setUserInfo(res.data);
      });
  };

  const getUserBoard = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}/board/userboardlist`, {
        withCredentials: true,
      })
      .then((res) => {
        setUserBoard(res.data);
      });
  };

  const getUserChat = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}/chat/getchatroom`, {
        withCredentials: true,
      })
      .then((res) => {
        const modifiedChats = res.data.map((chat) => {
          const chat_title = chat.chat_name
            .split("&")
            .find((part) => part !== nickname);
          return {
            chat_id: chat.chat_id,
            chat_name: chat.chat_name,
            chat_title: chat_title,
            chat_time: chat.chat_time,
            chat_category: chat.chat_category,
          };
        });

        setUserChat(modifiedChats);
      });
  };

  const getUserComment = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}/comment/getusercomment`, {
        withCredentials: true,
      })
      .then((res) => {
        setUserComment(res.data.comments);
      });
  };

  const getUserCommunity = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}/community/getusercommunity`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("community", res.data);
        setUserCommunity(res.data);
      });
  };

  useEffect(() => {
    getUserProfile();
    getUserBoard();
    getUserChat();
    getUserComment();
    getUserCommunity();
  }, []);

  const [currentPageDM, setCurrentPageDM] = useState(1);
  const [itemsPerPageDM] = useState(4);

  const getCurrentPageItemsDM = () => {
    const startIndex = (currentPageDM - 1) * itemsPerPageDM;
    const endIndex = startIndex + itemsPerPageDM;
    return userChat.slice(startIndex, endIndex);
  };

  // const [showEditModal, setShowEditModal] = useState(false);

  // const handleEditClick = () => {
  //   setShowEditModal(true);
  // };

  // const handleCloseModal = () => {
  //   setShowEditModal(false);
  // };

  // const handleSaveChanges = (editedName, editedIntro) => {
  //   axios.put(`${process.env.REACT_APP_HOST}/user/updatedoginfo`, {
  //     dog_name: editedName,
  //     dog_intro: editedIntro
  //   }, {
  //     withCredentials: true,
  //   }).then((res) => {
  //     setUserInfo(res.data);
  //   }).catch((error) => {
  //     console.error("Error updating profile:", error);
  //     if (error.response) {
  //       console.error("Server responded with error:", error.response.data);
  //       console.error("Status code:", error.response.status);
  //     } else if (error.request) {
  //       console.error("No response received:", error.request);
  //     } else {
  //       console.error("Error setting up the request:", error.message);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   if (Object.keys(userInfo).length !== 0) {
  //     handleSaveChanges(userInfo.dog_name, userInfo.dog_intro);
  //   }
  // }, [userInfo]);

  return (
    <>
      <div className={styles.mypageContainer}>
        <p className={styles.header}>마이페이지</p>
        <div className={styles.divisionLine}></div>

        <div className={styles.topBox}>
          <div className={styles.infoBox}>
            <div className={styles.picture}>
              <img
                src={`${process.env.REACT_APP_HOST}${
                  userInfo && userInfo.image
                }`}
                alt="프로필 사진"
              />
            </div>

            <div className={styles.info}>
              <p className={styles.nickname}>{userInfo && userInfo.nickname}</p>
              <p className={styles.introduction}>
                {userInfo && userInfo.dog_name}
              </p>
              <p className={styles.introduction}>
                {userInfo && userInfo.dog_intro}
              </p>
              {/* <button className={styles.editButton}>정보수정</button> */}
            </div>
          </div>

          {/* {showEditModal && <UserEditModal onClose={handleCloseModal} onSave={handleSaveChanges} />} */}

          <div className={styles.comContainer}>
            <p className={styles.comP}>참여소모임</p>
            <table className={styles.comlistTable}>
              <tbody>
                {userCommunity.length > 0 &&
                  userCommunity.map((value) => (
                    <tr
                      key={value.community_id}
                      onClick={() =>
                        navigate(
                          `/communityboard/community/${value.community_id}`
                        )
                      }
                    >
                      <td>{value.community_name}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <br />

        <div className={styles.boardTableContainer}>
          <button
            className={styles.tableTab}
            onClick={() => setShowWriteTable(true)}
          >
            작성 글
          </button>
          <button
            className={styles.tableTab}
            onClick={() => setShowWriteTable(false)}
          >
            작성 댓글
          </button>

          {showWriteTable ? (
            <table className={styles.boardTable}>
              <thead>
                <tr>
                  <th>게시판</th>
                  <th>제목</th>
                  <th>조회수</th>
                  <th>날짜</th>
                </tr>
              </thead>

              <tbody>
                {getCurrentPageItems().map((value) => (
                  <tr
                    key={value.board_id}
                    onClick={() => navigate(`/board/${value.board_id}`)}
                  >
                    <td>{value.category}</td>
                    <td>{value.title}</td>
                    <td>{value.viewcount}</td>
                    <td>{value.makeboard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className={styles.commentTable}>
              <thead>
                <tr>
                  <th>게시판</th>
                  <th>제목</th>
                  <th>댓글</th>
                  <th>날짜</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageItems().map((value) => (
                  <tr
                    key={value.comment_id}
                    onClick={() => navigate(`/board/${value.board_id}`)}
                  >
                    <td>{value.Board.category}</td>
                    <td>{value.Board.title}</td>
                    <td>{value.comment_content}</td>
                    <td>{value.makecomment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div>
          {showWriteTable
            ? userBoard.length > 0 && (
                <div className={styles.pageButtonBox}>
                  <button
                    className={styles.pageButton}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    이전
                  </button>
                  <span>{currentPage}</span>
                  <button
                    className={styles.pageButton}
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(userBoard.length / itemsPerPage)
                        )
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(userBoard.length / itemsPerPage)
                    }
                  >
                    다음
                  </button>
                </div>
              )
            : userComment.length > 0 && (
                <div className={styles.pageButtonBox}>
                  <button
                    className={styles.pageButton}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    이전
                  </button>
                  <span>{currentPage}</span>
                  <button
                    className={styles.pageButton}
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(userComment.length / itemsPerPage)
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(userComment.length / itemsPerPage)
                    }
                  >
                    다음
                  </button>
                </div>
              )}
        </div>

        <br />

        <div className={styles.dmListContainer}>
          <p className={styles.dmP}>쪽지함</p>
          <table className={styles.dmlistTable}>
            <tbody>
              {userChat.length > 0 &&
                userChat.map((value) => (
                  <tr
                    key={value.chat_id}
                    onClick={() => navigate(`/dm/${value.chat_name}`)}
                  >
                    <td>✉️</td>
                    <td>{value.chat_title}</td>
                    <td></td>
                    <td>{value.chat_time}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {userChat.length > 0 && (
          <div className={styles.pageButtonBox2}>
            <button
              className={styles.pageButton2}
              onClick={() => setCurrentPageDM((prev) => Math.max(prev - 1, 1))}
              disabled={currentPageDM === 1}
            >
              이전
            </button>
            <span>{currentPageDM}</span>
            <button
              className={styles.pageButton2}
              onClick={() =>
                setCurrentPageDM((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(userChat.length / itemsPerPageDM)
                  )
                )
              }
              disabled={
                currentPageDM === Math.ceil(userChat.length / itemsPerPageDM)
              }
            >
              다음
            </button>
          </div>
        )}

        <br />
      </div>
    </>
  );
}
