import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './CommunityPage.module.scss';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CommunityPage() {
  const { pageNum } = useParams();
  const { community_id } = useParams();
  const [currentPageNum, setCurrentPageNum] = useState(Number(pageNum));
  const [page, setPage] = useState([]);
  const [board_id, setBoard_id] = useState(null);
  const { nickname } = useSelector((state) => state.user);
  const [communityData, setCommunityData] = useState(null);
  const [postsPerPage, setPostsPerPage] = useState(0);
  const [comments, getComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [editing, setEditing] = useState(false); // 수정 상태를 관리하기 위한 상태입니다.
  const [editingId, setEditingId] = useState(null); // 현재 수정 중인 댓글의 ID를 저장하는 상태입니다.
  const [editedContent, setEditedContent] = useState(''); // 수정된 내용을 관리하기 위한 상태입니다.
  const [isMember, setIsMember] = useState(false);
  const [memberList, setMemberList] = useState(null);
  const [authorId, setAuthorId] = useState(null);
  const [Onepage, setOnePage] = useState();

  function handleEditComment(id, currentContent) {
    setEditingId(id);
    setEditedContent(currentContent);
  }

  const fetchMembers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST}/community/getcommunitymembers/${community_id}`
      );
      if (response.data.result) {
        setMemberList(response.data.data);
        console.log('현재 모임 멤버 :', response.data.data);
        // 현재 사용자가 이미 가입된 상태인지 확인
        const member = response.data.data.some(
          (member) => member.nickname === nickname
        );
        setIsMember(member); // 현재 사용자가 멤버인지 여부를 state에 저장
      } else {
        console.error('커뮤니티 멤버 데이터를 불러오는데 실패하였습니다.');
      }
    } catch (error) {
      console.error(
        '커뮤니티 멤버 데이터를 불러오는 API 호출에 실패하였습니다:',
        error
      );
    }
  };

  async function handleUpdateComment(comment_id) {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_HOST}/comment/editcomment/${comment_id}`,
        { comment_content: editedContent },
        {
          withCredentials: true,
        }
      );

      if (response.data.result) {
        // 요청이 성공했다면, 수정 상태를 초기화하고 댓글 목록을 다시 불러옵니다.
        setEditingId(null);
        setEditedContent('');
        getPageAndCommentData(); // 댓글을 다시 불러오는 함수. 적절한 함수로 대체해주세요.
      } else {
        // 요청이 실패했다면, 에러 메시지를 보여줍니다.
        alert('댓글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const navigator = useNavigate();
  const formData = new FormData();

  // 함수 정의
  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onValid({ content: newComment });
    setNewComment('');
  };

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchMembers();
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

  // 페이지 및 댓글 데이터를 불러오는 함수를 합칩니다.
  const getPageAndCommentData = () => {
    const params = { pageNum: currentPageNum - 1 };

    axios
      .get(
        `${process.env.REACT_APP_HOST}/board/getboardcategory/${community_id}_자유`,
        {
          params: params,
        }
      )
      .then((response) => {
        if (response.data.posts.length > 0) {
          setPage(response.data.posts);
          setBoard_id(response.data.posts[currentPageNum - 1].board_id);
          setPostsPerPage(response.data.posts.length);
          setAuthorId(response.data.posts[currentPageNum - 1].user_id);

          const onePage = response.data.posts.find(
            (item) =>
              item.board_id === response.data.posts[currentPageNum - 1].board_id
          );
          setOnePage(onePage);

          console.log('게시물 데이터 불러오기 성공');
          console.log('원페이지 정보~~~', onePage);
          console.log('페이지 정보~~~', page);

          // 게시물 데이터를 불러온 후 댓글 데이터도 불러옵니다.
          axios
            .get(
              `${process.env.REACT_APP_HOST}/comment/getallcomment/${
                response.data.posts[currentPageNum - 1].board_id
              }`,
              { params: params }
            )
            .then((response) => {
              if (response.data.comments.length > 0) {
                // 'posts'를 'comments'로 변경
                console.log('댓글 불러오기');
                console.log('comments 정보', response.data.comments);
                console.log('nickname:', nickname);
                getComments(response.data.comments); // 'posts'를 'comments'로 변경
              } else {
                console.log('댓글 배열을 받아왔으나 비어있거나 없음');
              }
            })
            .catch((err) => console.error('API 요청 및 댓글 조회 오류', err));
        } else {
          console.log('posts 배열이 비어있거나 없음');
        }
      })
      .catch((err) => console.error('API 요청 및 페이지, 댓글 조회 오류', err));
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
          navigator(
            `/communityboard/community/${community_id}/communityinnerboard/`
          );
          window.location.reload();
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
          console.log('res.data : ', res.data);
          console.log('data.comment_content : ', data.comment_content);

          getPageAndCommentData();
          reset({
            comment_content: '', // 초기화할 필드의 이름과 초기값
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 게시글 수정
  const editWrite = () => {
    console.log('페이지 정보 보내기', page);
    navigator(
      `/communityboard/community/${community_id}/communityinnerboard/CommunityWrite/${board_id}/update`,
      {
        state: { value: { Onepage } },
      }
    );
  };

  const handleDeleteComment = (comment_id) => {
    console.log(comment_id);
    axios
      .delete(
        `${process.env.REACT_APP_HOST}/comment/deletecomment/${comment_id}`,

        { withCredentials: true } // 세션 정보 포함 옵션 추가
      )
      .then((response) => {
        if (response.data.result) {
          console.log('댓글 삭제 정보 확인', comment_id);
          getPageAndCommentData();
        } else {
          console.log('정보를 벡엔드에 전달했으나 실패(리스폰옴)');
        }
      })
      .catch((error) =>
        console.error(
          '댓글 삭제 정보 전달이 되지 않았음(리스폰스 안옴):',
          error
        )
      );
  };

  useEffect(() => {
    getPageAndCommentData();
  }, [currentPageNum]);

  const handleNextPage = () => {
    const nextPageNum = currentPageNum + 1;
    if (nextPageNum > page.length) {
      console.log('마지막 글입니다. 현재 게시물 인덱스: ', currentPageNum); // 마지막 페이지 도달 시 현재 인덱스 출력
    } else {
      console.log('현재 게시물 인덱스', nextPageNum);
      setCurrentPageNum(nextPageNum);

      // 주소창에 페이지 번호를 반영합니다.
      navigator(
        `/communityboard/community/${community_id}/communityinnerboard/CommunityPage/${nextPageNum}`
      );
    }
  };

  const handleBack = () => {
    navigator(`/communityboard/community/${community_id}/communityinnerboard/`);
  };

  const handlePrevPage = () => {
    const prevPageNum = currentPageNum - 1;
    if (prevPageNum < 1) {
      console.log('첫번째 글입니다. 현재 게시물 인덱스: ', currentPageNum); // 첫 페이지 도달 시 현재 인덱스 출력
    } else {
      console.log('현재 게시물 인덱스', prevPageNum);
      setCurrentPageNum(prevPageNum);

      navigator(
        `/communityboard/community/${community_id}/communityinnerboard/CommunityPage/${prevPageNum}`
      );
    }
  };

  const RenderContainer = ({ classname, children }) => (
    <div className={`${styles.container} ${classname}`}>{children}</div>
  );

  const RenderDetail = ({ label, data }) => (
    <div className={styles[label]}>{`${label} : ${data}`}</div>
  );

  const RenderButton = ({ classname, handleFunction, label }) => (
    <button
      className={`${styles.button} ${classname}`}
      onClick={handleFunction}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.media}>
          <RenderContainer classname={styles.main}>
            {page.map(
              (post, index) =>
                index === currentPageNum - 1 && (
                  <div key={index}>
                    <RenderContainer classname={`${styles.page} ${styles.one}`}>
                      {communityData.community_name} 게시판
                      <div className={styles.detail}>
                        <RenderDetail label="작성자" data={post.user_id} />
                        <RenderDetail label="댓글" data={post.commentNum} />
                        <RenderDetail label="조회수" data={post.viewcount} />
                      </div>
                      <div className={styles.Title}>{post.title}</div>
                    </RenderContainer>

                    <RenderContainer classname={`${styles.page} ${styles.two}`}>
                      <div className={styles.Content}>{post.content}</div>
                      <div className={`${styles.container} ${styles.comment}`}>
                        <table className={styles.commentsTable}>
                          <tbody>
                            {comments.map((comment, index) => (
                              <tr key={index}>
                                <td className={styles.cWriter}>
                                  {comment.user_id}
                                </td>
                                <td className={styles.cContent}>
                                  {editingId === comment.comment_id ? (
                                    <input
                                      type="text"
                                      value={editedContent}
                                      onChange={(e) =>
                                        setEditedContent(e.target.value)
                                      }
                                    />
                                  ) : (
                                    comment.comment_content
                                  )}
                                  {/* {comment.comment_id} */}
                                </td>
                                {comment.user_id === nickname && isMember && (
                                  <td>
                                    <button
                                      onClick={() =>
                                        handleDeleteComment(comment.comment_id)
                                      }
                                    >
                                      삭제
                                    </button>
                                    {editingId === comment.comment_id ? (
                                      <button
                                        onClick={() =>
                                          handleUpdateComment(
                                            comment.comment_id
                                          )
                                        }
                                      >
                                        저장
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleEditComment(
                                            comment.comment_id,
                                            comment.comment_content
                                          )
                                        }
                                      >
                                        수정
                                      </button>
                                    )}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {isMember && (
                        <div
                          className={`${styles.container} ${styles.commentwrite}`}
                        >
                          <form onSubmit={handleSubmit(onValid)}>
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
                        </div>
                      )}
                    </RenderContainer>
                  </div>
                )
            )}

            <div className={styles.tab}>
              <RenderButton
                classname={styles.prev}
                handleFunction={handlePrevPage}
                label="이전 게시글"
              />
              <RenderButton
                classname={styles.next}
                handleFunction={handleNextPage}
                label="다음 게시글"
              />
              <RenderButton
                classname={styles.back}
                handleFunction={handleBack}
                label="목록으로"
              />
              {authorId === nickname && isMember && (
                <RenderButton
                  classname={styles.back}
                  handleFunction={boardDelete}
                  label="삭제"
                />
              )}
              {authorId === nickname && isMember && (
                <RenderButton
                  classname={styles.back}
                  handleFunction={editWrite}
                  label="수정"
                />
              )}
            </div>
          </RenderContainer>
        </div>
      </div>
    </>
  );
}
