import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './post.module.scss';
import axios from 'axios';

export default function Post() {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigator = useNavigate();
  const [post, setPost] = useState({}); // 게시글 (조회)
  const [comments, setComments] = useState([]); // 댓글
  const { board_id } = useParams(); // 게시판 id
  const [userNickname, setUserNickname] = useState(''); // 게시글 작성자 닉네임
  const { nickname } = useSelector((state) => state.user); //  현재 로그인한 사용자의 닉네임 (redux 스토어 조회)
  const formData = new FormData();

  const [editingId, setEditingId] = useState(null); // 현재 수정 중인 id를 저장하는 상태

  const [editPostContent, setEditPostContent] = useState(''); // 글 수정
  const [editCommentContent, setEditCommentContent] = useState(''); // 댓글 수정 내용을 관리하기 위한 상태

  const [editing, setEditing] = useState(null); // 수정 모드 상태 (어떤 댓글이 수정 중인지)
  const [editInput, setEditInput] = useState(''); // 수정 입력 상태 (수정하는 입력의 현재 값)

  function handleEditComment(id, currentContent, currentComment) {
    setEditingId(id); // 현재 수정 중인 id
    setEditPostContent(currentContent); // 글 수정 내용
    setEditCommentContent(currentComment); // 댓글 수정 내용
  }

  // 게시글 조회
  const getBoard = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}/board/getboardid/${board_id}`)
      .then((res) => {
        console.log('res.data ', res.data);
        setUserNickname(res.data.nickname);

        let modifiedPost = res.data.board; // 날짜 형식 변경
        let date = new Date(modifiedPost.makeboard);
        modifiedPost.makeboard = date
          .toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .replace(/. /g, '.');

        setPost(modifiedPost);
      });
  };

  // 게시글 수정
  const boardUpdate = async (board_id) => {
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_HOST}/board/boardupdate/${board_id}`,
        {
          content: editPostContent,
        },
        {
          withCredentials: true,
        }
      );
      console.log('res.data : ', res.data);

      if (res.data.result) {
        // .then((res) => {
        getBoard(); // 글 조회
        getComments(); // 댓글 조회
        console.log('수정되었습니다.');
        getBoard();
      } else {
        alert('게시글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('오류오류~');
    }
  };

  // 게시글 삭제
  const boardDelete = () => {
    console.log('board_id', board_id);
    axios
      .delete(`${process.env.REACT_APP_HOST}/board/boarddelete/${board_id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.result) {
          // 게시글 삭제 성공
          console.log('게시글을 삭제했습니다.');
          alert('게시글을 삭제했습니다.');
          navigator('/board');
        } else {
          // 게시글 삭제 실패
          console.log('게시글 삭제 실패');
        }
      })
      .catch((err) => {
        // 네트워크 요청 실패 또는 백엔드에서 처리 과정에서 에러 발생
        console.error('게시글 삭제 요청 또는 처리 과정에서 에러 발생:', err);
      });
  };

  // 댓글 작성(등록)
  const onValid = (data) => {
    console.log('data : ', data);
    console.log('formData : ', formData);
    console.log('댓글 : ', data.comment_content);

    axios
      .post(
        `${process.env.REACT_APP_HOST}/comment/postcomment/${board_id}`,
        {
          comment_content: data.comment_content, // 댓글 데이터
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.result) {
          getComments(); // 댓글 목록을 다시 불러오는 함수를 호출
          console.log('res.data : ', res.data);
          console.log('data.comment_content : ', data.comment_content);
          reset({
            comment_content: '', // 초기화할 필드의 이름과 초기값
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 댓글 조회
  const getComments = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}/comment/getallcomment/${board_id}`)
      .then((res) => {
        if (res.data.comments) {
          // res.data.comments가 있을 때만 받아 옴
          setComments(res.data.comments);
        }
        console.log('res.data.comments : ', res.data.comments);
      });
  };

  // 댓글 수정
  const editComment = (id) => {
    setEditing(id);
    const comment = comments.find((c) => c.comment_id === id);
    setEditInput(comment.comment_content);
  };

  // 댓글 수정 (수정된 댓글을 서버에 보냄)
  const saveComment = async (comment_id) => {
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_HOST}/comment/editcomment/${comment_id}`,
        {
          comment_content: editCommentContent, // 댓글 수정
        },
        {
          withCredentials: true,
        }
      );
      console.log('res.data : ', res.data);

      if (res.data.result) {
        // 요청이 성공했다면, 수정 상태를 초기화하고 댓글 목록을 다시 불러온다
        setEditingId(null);
        setEditCommentContent(''); // 댓글 수정

        // getBoard(); // 글 조회
        getComments(); // 댓글 조회
        console.log('수정되었습니다.');
        window.location.reload(); // 페이지 리로드
      } else {
        alert('댓글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('오류오류~');
    }
  };

  // 댓글 삭제
  const deleteComment = (comment_id) => {
    console.log('comment_id', comment_id);
    axios
      .delete(
        `${process.env.REACT_APP_HOST}/comment/deletecomment/${comment_id}`,
        { withCredentials: true } // 세션 정보 포함 옵션 추가
      )
      .then((res) => {
        if (res.data.result) {
          alert('댓글을 삭제했습니다.');
          console.log('댓글을 삭제했습니다.');
          getComments(); // 댓글 목록을 다시 불러오는 함수를 호출
        } else {
          console.log('res.data.result', res.data.result); // false
          console.log('정보를 벡엔드에 전달했으나 실패(리스폰옴)');
        }
      })
      .catch((err) =>
        console.error('댓글 삭제 정보 전달이 되지 않았음(리스폰스 안옴):', err)
      );
  };

  useEffect(() => {
    getBoard();
    getComments();
  }, []);

  return (
    <>
      {
        <div className={styles.bg}>
          <div className={styles.container}>
            <h2>게시글</h2>
            <div className={styles.category}>{post.category}게시판</div>

            <div className={styles.innerContainer}>
              <div className={styles.title}>{post.title}</div>

              <span
                className={styles.user}
                onClick={() => {
                  if (nickname === userNickname) {
                    navigator('/mypage');
                  } else {
                    navigator(`/userprofile/${userNickname}`);
                  }
                }}
              >
                작성자 {userNickname}
              </span>

              <div className={styles.makeboard}>{post.makeboard}</div>

              {/* 글 작성자와 로그인한 사용자가 동일한 경우에만 수정 / 삭제 버튼을 보여줌 */}
              {userNickname === nickname && (
                <div className={styles.contentsBtn}>
                  {/* <button onClick={() => boardUpdate()}>글수정</button> */}
                  <button
                    onClick={() => navigator(`/board/edit/${board_id}`)}
                    className={styles.textEditBtn}
                  >
                    글수정
                  </button>
                  <button
                    onClick={() => boardDelete()}
                    className={styles.textDelBtn}
                  >
                    글삭제
                  </button>
                </div>
              )}

              <div className={styles.divisionLine}></div>

              <div className={styles.imgContainer}>
                {post.image && (
                  <img
                    src={`${process.env.REACT_APP_HOST}${post.image}`}
                    alt="게시물 사진"
                    className={styles.img}
                  />
                )}
              </div>
              <div className={styles.content}>{post.content}</div>

              <div className={styles.divisionLine}></div>

              {/* 댓글 입력 */}
              <p>댓글</p>
              <form
                onSubmit={handleSubmit(onValid)}
                className={styles.commentsForm}
              >
                <div className={styles.comments}>
                  <textarea
                    className={styles.commentsText}
                    placeholder="댓글을 입력해주세요"
                    {...register('comment_content')}
                  ></textarea>
                </div>

                <button type="submit" className={`${styles.btn}`}>
                  등록
                </button>
              </form>

              {/* 댓글 창 */}
              <div className={styles.commentContainer}>
                {comments.map((comment, index) => (
                  <div key={index} className={styles.commentContainer2}>
                    {editing === comment.comment_id ? (
                      <input
                        type="text"
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        className={styles.commentInput}
                      />
                    ) : (
                      <>
                        <div className={styles.comment}>
                          <div className={styles.nickname}>
                            {comment.User.nickname}
                          </div>
                          <div className={styles.commentContent}>
                            {comment.comment_content}
                          </div>
                          <div className={styles.makecomment}>
                            {comment.makecomment}
                          </div>
                        </div>
                      </>
                    )}

                    {/* 댓글 작성자와 로그인한 사용자가 동일한 경우에만 수정 / 삭제 버튼을 보여줌 */}
                    {comment.User.nickname === nickname && (
                      <div className={styles.commentBtn}>
                        {editing === comment.comment_id ? (
                          <button
                            onClick={() => saveComment(comment.comment_id)}
                            className={styles.saveBtn}
                          >
                            저장
                          </button>
                        ) : (
                          <button
                            onClick={() => editComment(comment.comment_id)}
                            className={styles.editBtn}
                          >
                            수정
                          </button>
                        )}
                        <button
                          onClick={() => deleteComment(comment.comment_id)}
                          className={styles.delBtn}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}
