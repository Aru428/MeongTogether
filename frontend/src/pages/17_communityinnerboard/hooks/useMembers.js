import { useState, useEffect } from "react";
import axios from "axios";

export function useMembers(community_id, nickname) {
  const [memberList, setMemberList] = useState(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HOST}/community/getcommunitymembers/${community_id}`
        );
        if (response.data.result) {
          setMemberList(response.data.data);
          const member = response.data.data.some(
            (member) => member.nickname === nickname
          );
          setIsMember(member);
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
    fetchMembers();
  }, [community_id, nickname]);

  return { memberList, isMember };
}
