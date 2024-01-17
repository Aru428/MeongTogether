import React, { useState, useEffect } from "react";
import styles from "./CommunityBoard.module.scss";

import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { useImages } from "./hooks/useImages";
import { useGroups } from "./hooks/useGroups";
import { usePagination } from "./hooks/usePagination";
import { useSearch } from "./hooks/useSearch";
import { useAuthNavigation } from "./hooks/useAuthNavigation";
import { useAxios } from "./hooks/useAxios";

import SearchGroupForm from "./components/SearchGroupForm";
import GroupItem from "./components/GroupItem";

const imageFiles = [
  "c_pic (1).png",
  "c_pic (2).png",
  "c_pic (3).png",
  "c_pic (4).png",
  "c_pic (5).png",
  "c_pic (6).png",
  "c_pic (7).png",
  "c_pic (8).png",
];
export default function CommunityBoard() {
  const { nickname } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const images = useImages();
  const { Group, setGroup, hotGroups, setHotGroups } = useGroups();
  const { searchQuery, setSearchQuery, filteredGroups, handleSearch } =
    useSearch(Group, setGroup, hotGroups, setHotGroups);
  const { currentPage, nextPage, prevPage } = usePagination(
    filteredGroups.length,
    4
  );

  const indexOfLastGroup = currentPage * 4;
  const indexOfFirstGroup = indexOfLastGroup - 4;
  const currentGroups = filteredGroups.slice(
    indexOfFirstGroup,
    indexOfLastGroup
  );

  const navigatePage = useAuthNavigation(
    "/communityboard/makecommunity",
    "/user/signin"
  );

  const handleClick = navigatePage;

  const {
    data: groups,
    loading,
    error,
  } = useAxios(`${process.env.REACT_APP_HOST}/community/getcommunities`, "get");

  useEffect(() => {
    if (!loading && !error) {
      setGroup(groups);
      setHotGroups(groups.slice(0, 3));
    }
  }, [groups, loading, error]);

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.S_1}>
          <div className={styles.CommunityBoardHead}>
            👨‍👩‍👧‍👦 소모임 리스트
            <SearchGroupForm setSearchQuery={setSearchQuery} />
          </div>
          <div className={styles.Hotbar_1}>
            <h4 className={styles.Hotbar_1_t}>
              인기 모임탭(참여율(인원) 높은 소모임)
            </h4>
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              className={styles.hotzone}
              autoplay={true}
              autoplaySpeed={4000}
            >
              {hotGroups.map((group, index) => {
                const randomIndex = Math.floor(Math.random() * images.length);
                return (
                  <Link
                    to={`/communityboard/community/${group.community_id}`}
                    key={index}
                  >
                    <div className={styles.Hotbar_2}>
                      <div className={styles.Hotbar_3}>
                        <img
                          className={styles.CommuPic}
                          src={images[randomIndex]}
                          alt="모임사진"
                          title="모임 프로필"
                        />
                        <div className={styles.Profile}>
                          지역: {group.community_local} <br />
                          모임명: {group.community_name} <br />
                          소개: {group.introduce} <br />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </Slider>
          </div>
        </div>

        <div className={styles.S_2}>
          <div className={styles.c_buttons}>
            <div className={styles.pagination}>

              <button onClick={prevPage}> {"◀ "} 이전</button>
              <span>{currentPage}</span>
              <button onClick={nextPage}>다음{" ▶"}</button>
            </div>
            <button onClick={handleClick} className={styles.MakeGroup}>
              새 모임 만들기 +
            </button>
          </div>
          {currentGroups.map((group, index) => {
            const randomIndex = Math.floor(Math.random() * images.length);
            return (
              <GroupItem
                key={index}
                group={group}
                image={images[randomIndex]}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
