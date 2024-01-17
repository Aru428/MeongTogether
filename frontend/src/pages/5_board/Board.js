import styles from './Board.module.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import view from './view.png';
import { useSelector } from 'react-redux';

export default function Board() {
  const [allboardList, setAllBoardList] = useState([]);
  const [filteredBoardList, setFilteredBoardList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);
  const postsPerPage = 8;

  const getBoard = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}/board/getallboard`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setAllBoardList(res.data.posts);
        setFilteredBoardList(res.data.posts); // 처음에는 모든 게시물을 보여줌
      });
  };

  useEffect(() => {
    getBoard();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBoardList]);

  const handleCategoryClick = (category) => {
    // 카테고리를 클릭했을 때 호출되는 함수
    setSelectedCategory(category);

    if (category === '전체') {
      setFilteredBoardList(allboardList); // '전체' 카테고리 선택 시 전체 게시물 표시
    } else {
      // 선택된 카테고리에 해당하는 게시물만 필터링
      const filteredList = allboardList.filter(
        (item) => item.category === category
      );
      setFilteredBoardList(filteredList);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBoardList.slice(
    indexOfFirstPost,
    indexOfLastPost
  );
  const totalPages = Math.ceil(filteredBoardList.length / postsPerPage);

  const nextPage = () => {
    if (indexOfLastPost < filteredBoardList.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleWriteClick = () => {
    if (isLoggedIn) {
      navigate(`/board/write`);
    } else {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/user/signin');
    }
  };

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.category}>
          <ul>
            <li>
              <a onClick={() => handleCategoryClick('전체')}>전체</a>
            </li>
            <li>
              <a onClick={() => handleCategoryClick('일상')}>일상</a>
            </li>
            <li>
              <a onClick={() => handleCategoryClick('질문')}>질문</a>
            </li>
            <li>
              <a onClick={() => handleCategoryClick('실종/포착')}>실종/포착</a>
            </li>
          </ul>

          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chevron-left"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
                이전
              </svg>
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              className={styles.pageButton}
              onClick={nextPage}
              disabled={indexOfLastPost >= filteredBoardList.length}
            >
              {' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chevron-right"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
                다음
              </svg>
            </button>
          </div>

          <div className={styles.writeButton} onClick={handleWriteClick}>
            글쓰기
          </div>
        </div>

        <div className={styles.contents}>
          {currentPosts.length > 0 &&
            currentPosts.map((value) => (
              <div
                className={styles.box}
                key={value.board_id}
                onClick={() => navigate(`/board/${value.board_id}`)}
              >
                <div className={styles.bar}>
                  <p className={styles.category_contents}>{value.category}</p>
                  <p className={styles.title}>
                    {value.title.length > 10
                      ? `${value.title.substring(0, 10)}...`
                      : value.title}
                  </p>
                  <p className={styles.content}>
                    {value.content.length > 15
                      ? `${value.content.substring(0, 15)}...`
                      : value.content}
                  </p>
                  <p className={styles.user_id}>{value.user_id}</p>
                  <p className={styles.viewcount}>
                    <img src={view} className={styles.viewPic} />
                    {value.viewcount}
                  </p>
                </div>

                <p className={styles.image}>
                  {value.image && (
                    <img
                      src={`${process.env.REACT_APP_HOST}${value.image}`}
                      alt="게시물 사진"
                    />
                  )}
                </p>
                <p className={styles.makeboard}>{value.makeboard}</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
