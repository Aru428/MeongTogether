import styles from "./Home.module.scss";
import plus from "./플러스.png";
import polygon from "./Polygon 1.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [dogs, setDogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dogsPerPage] = useState(3);
  const [newBoard, setNewBoard] = useState([]);
  const [hotBoard, setHotBoard] = useState([]);

  const getApi = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}/dog/getapi`)
      .then((res) => {
        console.log(res.data);
        setDogs(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getBoard = () => {
    axios.get(`${process.env.REACT_APP_HOST}/board/getallboard`).then((res) => {
      console.log("getboard", res);
      setNewBoard(res.data.posts.slice(0, 5));
      const sortedPosts = res.data.posts.sort(
        (a, b) => b.viewcount - a.viewcount
      );
      setHotBoard(sortedPosts.slice(0, 5));
    });
  };

  useEffect(() => {
    getApi();
    getBoard();
  }, []);

  const indexOfLastDog = currentPage * dogsPerPage;
  const indexOfFirstDog = indexOfLastDog - dogsPerPage;
  const currentDogs = dogs.slice(indexOfFirstDog, indexOfLastDog);
  const totalPages = Math.ceil(dogs.length / dogsPerPage);

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(dogs.length / dogsPerPage)));
  };


  return (
    <>

      <div className={styles.bgHome}>
        <p><a href="/shelterboard">가족을 찾아요</a></p>
        <div className={styles.findDog}>
          <img src={polygon} className={styles.polygonPic1} onClick={prevPage}
            disabled={currentPage === 1}/>
          {currentDogs.map((data, index) => (
            <div className={styles.picBar} key={index}>
              <img
                className={styles.DogPic}
                src={data.popfile}
                alt="강아지"
                title="멋진 우리 강아지!"
              />
              <div className={styles.finddogInfo}>
                <div className={styles.title}> {data.kindCd}</div>
                <div className={styles.author}> {data.careNm}</div>
              </div>
            </div>
          ))}
          <img src={polygon} className={styles.polygonPic2} onClick={nextPage}
            disabled={indexOfLastDog >= dogs.length}/>
        </div>

        {/* <div className={styles.pagination}>
          <span>
            {currentPage} / {totalPages}
          </span>
        </div> */}

        <p><a href="/board">최신글</a></p>
        <div className={`${styles.Box} ${styles.newTopic}`}>
        <div className={styles.barBox}>
          {newBoard.length > 0 &&
            newBoard.map((value) => (
              <Link
                to={`/board/${value.board_id}`}
                key={value.board_id}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <div className={styles.bar} key={value.board_id}>
                  <div className={styles.boardCategory}>{value.category}
                  </div>
                  <div className={styles.boardTitle}>{value.title}
                    {/* {value.title.length > 5
                      ? `${value.title.substring(0, 5)}...`
                      : value.title} */}
                  </div>
                </div>
              </Link>
            ))}
        </div>
        </div>

        <br />

        <p><a href="/board">인기글</a></p>
        <div className={`${styles.Box} ${styles.hotTopic}`}>
          <div className={styles.barBox}>
          {hotBoard.length > 0 &&
            hotBoard.map((value) => (
              <Link
                to={`/board/${value.board_id}`}
                key={value.board_id}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <div className={styles.bar} key={value.board_id}>
                  <div className={styles.boardCategory}>{value.category}</div>
                  <div className={styles.boardTitle}>{value.title}
                    {/* {value.title.length > 5
                      ? `${value.title.substring(0, 5)}...`
                      : value.title} */}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
