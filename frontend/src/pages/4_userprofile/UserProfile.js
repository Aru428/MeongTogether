import styles from "./UserProfile.module.scss";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState({});
  const [userBoard, setUserBoard] = useState({});
  const { username } = useParams();
  const { isLoggedIn, nickname } = useSelector((state) => state.user);
  const navigator = useNavigate();

  const getUserProfile = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}/user/userprofile/${username}`)
      .then((res) => {
        setUserInfo(res.data);
      });
  };

  const getUserBoard = (userInfo) => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}/board/profileboardlist/${userInfo.user_id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        setUserBoard(res.data);
      });
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    if (userInfo) {
      getUserBoard(userInfo);
    }
  }, [userInfo]);

  const handleDmClick = () => {
    if (isLoggedIn) {
      axios
        .post(
          `${process.env.REACT_APP_HOST}/chat/createroom`,
          {
            chat_name: `${username}&${nickname}`,
            chat_category: "dm",
            user_id: userInfo.user_id,
          },
          { withCredentials: true }
        )
        .then((res) => {
          navigator(`/dm/${res.data.chat_name}`);
        });
    } else {
      alert("로그인이 필요한 서비스입니다.");
      navigator("/user/signin");
    }
  };

  return (
    <>
      <div className={styles.profileContainer}>
        <h2 className={styles.header}>프로필</h2>
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
              <button className={styles.messageButton} onClick={handleDmClick}>
                쪽지 보내기
              </button>
            </div>
          </div>
        </div>

        <div className={styles.boardTableContainer}>
          <p className={styles.tableTab}>작성 글</p>
          <table className={styles.boardTable}>
            <thead>
              <tr>
                <th>게시판</th>
                <th>제목</th>
                <th>날짜</th>
                <th>조회수</th>
              </tr>
            </thead>

            <tbody>
              {userBoard.length > 0 &&
                userBoard.map((value) => (
                  <tr
                    key={value.board_id}
                    onClick={() => navigator(`/board/${value.board_id}`)}
                  >
                    <td>{value.category}</td>
                    <td>{value.title}</td>
                    <td>{value.viewcount}</td>
                    <td>{value.makeboard}</td>
                  </tr>
                ))}
              {/* <tr>
                <td>일상</td>
                <td>행복한 저녁 시간~</td>
                <td>2024-01-05</td>
                <td>100</td>
              </tr>
              <tr>
                <td>자유</td>
                <td>이럴 때는 어쩌죠?</td>
                <td>2024-01-05</td>
                <td>100</td>
              </tr>
              <tr>
                <td>일상</td>
                <td>꼬까옷 입고 폴짝!</td>
                <td>2024-01-05</td>
                <td>100</td>
              </tr> */}
            </tbody>
          </table>
        </div>

        <br />
      </div>
    </>
  );
}
