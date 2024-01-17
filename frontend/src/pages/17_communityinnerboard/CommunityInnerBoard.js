import styles from "./CommunityInnerBoard.module.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useMembers } from "./hooks/useMembers";
import { useCommunityData } from "./hooks/useCommunityData";
import { usePosts } from "./hooks/usePosts";
import { useNavigation } from "./hooks/useNavigation";

import PostTable from "./components/PostTable";
import NavigationButtons from "./components/NavigationButtons";

export default function CommunityInnerBoard() {
  const { community_id } = useParams();
  const { nickname } = useSelector((state) => state.user);
  const {
    // memberList,
    isMember,
  } = useMembers(community_id, nickname);

  const communityData = useCommunityData(community_id);
  const {
    posts,
    // error
  } = usePosts(community_id);

  const {
    handlePostClick,
    writeClick,
    BackClick,
    // setBoardId,
    // boardId,
    // location,
  } = useNavigation(community_id);

  return (
    <>
      <div className={styles.box1}>
        <div className={`${styles.container} ${styles.one}`}>
          <h1 className={`${styles.tt}`}>
            <>
              📬 {communityData ? communityData.community_name : "Loading..."}{" "}
              게시판
            </>
          </h1>

          <div className={`${styles.container} ${styles.two}`}>
            <PostTable posts={posts} onPostClick={handlePostClick} />

            <div className={styles.flex}>
              <NavigationButtons
                isMember={isMember}
                onWriteClick={writeClick}
                onBackClick={BackClick}
              />
            </div>

            <div className={styles.box2}></div>
          </div>
        </div>
      </div>
    </>
  );
}
