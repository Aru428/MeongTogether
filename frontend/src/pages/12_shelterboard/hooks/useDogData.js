import { useState, useEffect } from "react";
import axios from "axios";

export default function useDogData() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getApi = () => {
    setLoading(true); // API 호출 시작 시 로딩 상태를 true로 설정
    axios
      .get(`${process.env.REACT_APP_HOST}/dog/getapi`) // 요청할 API의 주소를 입력해주세요.
      .then((res) => {
        console.log(res.data);
        setDogs(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false); // API 호출이 끝나면 로딩 상태를 false로 설정
      });
  };

  useEffect(() => {
    getApi();
  }, []);

  return { dogs, loading };
}
