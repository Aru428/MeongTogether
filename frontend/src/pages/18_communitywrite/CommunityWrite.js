import styles from "./CommunityWrite.module.scss";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

import axios from 'axios';

export default function CommunityWrite() {
  const [communityData, setCommunityData] = useState(null); // new state for community data
  const { community_id } = useParams();
  const navigator = useNavigate();
  const location = useLocation();
  const update_D =
    location.state && location.state.value ? location.state.value : "기본값";

  const [Page_Data, setPage_Data] = useState({
    board_id: "",
    category_get: "",
    content_get: "",
    title_get: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const updatePageData = async () => {
      if (update_D && update_D.Onepage) {
        await setPage_Data((prevData) => ({
          board_id: update_D.Onepage.board_id || prevData.board_id_get,
          category_: update_D.Onepage.category || prevData.category_get,
          content_: update_D.Onepage.content || prevData.content_get,
          introduce: update_D.Onepage.title || prevData.title_get,
        }));

        // 게시글 정보를 input 필드에 설정
        const categoryValue = update_D.Onepage.category;
        const selectedCategory = categoryValue.includes("_자유")
          ? "자유게시판"
          : categoryValue.includes("_공지")
          ? "공지게시판"
          : null;
        setValue("category", selectedCategory);
        setValue("title", update_D.Onepage.title);
        setValue("content", update_D.Onepage.content);
      }
    };
    updatePageData();
  }, [update_D, setValue]);

  useEffect(() => {
    console.log("update_D:", update_D);
    console.log("페이지_Data: 받았음", Page_Data);
  }, [Page_Data, update_D]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}/community/getcommunity/${community_id}`
      )
      .then((response) => {
        if (response.data.result) {
          setCommunityData(response.data.data);
        } else {
          console.error('커뮤니티 데이터를 불러오는데 실패하였습니다.');
        }
      })
      .catch((error) => {
        console.error(
          '커뮤니티 데이터를 불러오는 API 호출에 실패하였습니다:',
          error
        );
      });
  }, [community_id]);

  const handleBack = () => {
    navigator(`/communityboard/community/${community_id}/communityinnerboard/`);
    window.location.reload();
  };

  // 기존 onValid 함수
  const onValid = (data) => {
    const postData = {
      title: data.title,
      category:
        data.category === '자유게시판'
          ? `${community_id}_자유`
          : `${community_id}_공지`,
      content: data.content,
    };

    // 만약 update_D가 존재하고 그 값이 '기본값'이 아니라면
    if (update_D && update_D !== "기본값") {
      // PATCH 요청을 보낸다
      axios
        .patch(
          `${process.env.REACT_APP_HOST}/board/boardupdate/${Page_Data.board_id}`,
          postData,
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res.data);
          console.log(
            "수정된 정보",
            postData,
            "보드아이디",
            Page_Data.board_id
          );
          handleBack();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // 그렇지 않다면 POST 요청을 보낸다
      axios
        .post(`${process.env.REACT_APP_HOST}/board/boardsubmit`, postData, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          handleBack();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.bg1}>
          <h2>
            📃{communityData ? communityData.community_name : 'Loading...'}{' '}
            소모임 게시글 작성
          </h2>
        </div>
        <div className={styles.bg2}>
          <form onSubmit={handleSubmit(onValid)}>
            <div className={styles.contentsContainer}>
              게시판
              <div
                className={styles['board-type-container']}
                {...register('category')}
              >
                <select className={styles['board-type-select']}>
                  <option>자유게시판</option>
                  <option>공지게시판</option>
                </select>
              </div>
              <br />
              제목
              <div className={styles['title-container']}>
                <br />
                <input
                  type="text"
                  className={styles['title-text']}
                  placeholder="제목을 입력해주세요"
                  {...register('title', {
                    required: '제목은 필수로 입력해야 합니다',
                  })}
                />{' '}
                {errors.title && (
                  <small role="alert" className={styles.error}>
                    {errors.title.message}
                  </small>
                )}
              </div>
              <br />
              <div className={styles['contents']}>
                내용
                <br />
                <textarea
                  className={styles['contents-text']}
                  {...register('content', {
                    required: '내용은 필수로 입력해야 합니다',
                  })}
                ></textarea>{' '}
                {errors.content && (
                  <small role="alert" className={styles.error}>
                    {errors.content.message}
                  </small>
                )}
              </div>
              <div className={styles.buttonsDiv}>
                <div className={styles['buttonsBar1']}>
                  <button type="submit" className={styles['submit-button']}>
                    등록
                  </button>
                  {/* <label className={styles["upload-button"]} htmlFor="picture">
                    사진 업로드
                    <input
                      {...register("image")}
                      id="picture"
                      type="file"
                      className={styles["hidden"]}
                      accept="image/*"
                      style={{ display: "none" }}
                      // formData()로 파일을 업로드할 때 encType 속성을 아래와 같이 명시해주어야 한다
                      encType="multipart/form-data"
                    />
                  </label> */}
                </div>
                <button
                  type="button"
                  onClick={handleBack}
                  className={styles['back-button']}
                >
                  목록으로
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
