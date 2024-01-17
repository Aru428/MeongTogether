import { useState, useEffect } from "react";
import axios from "axios";

export const usePosts = (community_id) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getApi = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_HOST}/board/getboardcategory/${community_id}_자유`
        );
        setPosts(res.data.posts);
      } catch (err) {
        setError(err);
      }
    };

    getApi();
  }, [community_id]);

  return { posts, error };
};
