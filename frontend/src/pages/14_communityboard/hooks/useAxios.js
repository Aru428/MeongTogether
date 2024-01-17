import { useState, useEffect } from "react";
import axios from "axios";

export const useAxios = (url, method, initialData = []) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios[method](url);
        setData(response.data.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []); // 종속성 배열을 빈 배열로 변경

  return { data, loading, error };
};
