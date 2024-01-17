// useGroups.js
import { useState, useEffect } from "react";
import axios from "axios";

export function useGroups(searchQuery) {
  // 검색 쿼리를 인자로 받습니다.
  const [Group, setGroup] = useState([]);
  const [hotGroups, setHotGroups] = useState([]);

  useEffect(() => {
    const url = searchQuery
      ? `${process.env.REACT_APP_HOST}/community/getcommunities?region=${searchQuery}`
      : `${process.env.REACT_APP_HOST}/community/getcommunities`; // 검색 쿼리가 있을 경우, 검색 쿼리에 맞는 그룹을 가져오도록 URL을 설정합니다.

    axios
      .get(url)
      .then((response) => {
        const groups = response.data.data;
        setGroup(groups);
        setHotGroups(groups.slice(0, 3)); // 상위 3개 그룹을 인기 그룹으로 설정
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [searchQuery]); // 검색 쿼리가 변경될 때마다 그룹 데이터를 새롭게 가져옵니다.

  return { Group, setGroup, hotGroups, setHotGroups };
}
