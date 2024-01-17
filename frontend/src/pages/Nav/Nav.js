import styles from './_Nav.module.scss';
import logo from './logo.png';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/action/nicknameAction';
import { useNavigate } from 'react-router-dom';

export default function Nav() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      axios
        .post(
          `${process.env.REACT_APP_HOST}/user/logout`,
          {},
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.result) {
            dispatch(logout());
            navigator('/');
          } else {
            alert('로그아웃에 실패하였습니다.');
          }
        })
        .catch((err) => {
          console.log(err);
          alert('error!');
        });
    }
  };

  return (
    <>
      <div className={styles.nav}>
        <div className={styles.navContainer}>
          <ul>
            <div className={styles.logo}>
              <a href="/">
                <img src={logo} alt="멍멍투게더 로고" />
              </a>
            </div>
            <li>
              <a className={styles.home} href="/">
                홈
              </a>
            </li>
            <li>
              <a href="/board">게시판</a>
            </li>
            <li>
              <a href="/communityboard">소모임</a>
            </li>
            <li>
              <a href="/shelterboard">유기견 공고</a>
            </li>

            {isLoggedIn ? (
              <>
                <li className={styles.signin}>
                  <a href="/mypage">마이페이지</a>
                </li>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <li>
                <a href="/user/signin">로그인</a>
              </li>
            )}
          </ul>
        </div>
        <div className={styles.navShadow} />
      </div>
    </>
  );
}
