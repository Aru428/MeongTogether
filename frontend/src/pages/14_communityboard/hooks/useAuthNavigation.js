import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useAuthNavigation = (authPage, unauthPage) => {
  const { nickname } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const navigatePage = () => {
    if (!nickname) {
      alert("소모임을 만들기 전에 로그인을 해주세요!");
      navigate(unauthPage);
    } else {
      navigate(authPage);
    }
  };

  return navigatePage;
};
