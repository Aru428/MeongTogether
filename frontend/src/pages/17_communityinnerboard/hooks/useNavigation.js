// useNavigation.js
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useNavigation = (community_id) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [boardId, setBoardId] = useState(null);

  const handlePostClick = (board_id) => {
    navigate(
      `/communityboard/community/${community_id}/communityinnerboard/communityPage/${board_id}`
    );
  };

  const writeClick = () => {
    navigate(
      `/communityboard/community/${community_id}/communityinnerboard/CommunityWrite`
    );
  };

  const BackClick = () => {
    navigate(`/communityboard/community/${community_id}`);
  };

  return {
    handlePostClick,
    writeClick,
    BackClick,
    setBoardId,
    boardId,
    location,
  };
};
