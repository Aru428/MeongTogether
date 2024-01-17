import { Link } from "react-router-dom";
import styles from "../CommunityBoard.module.scss";

function GroupItem({ group, image }) {
  return (
    <Link to={`/communityboard/community/${group.community_id}`}>
      <div className={styles.Groupbar}>
        <img
          className={styles.CommuPic}
          src={image}
          alt="모임사진"
          title="모임 프로필"
        />
        <div className={styles.Profile}>
          지역: {group.community_local} <br />
          모임명: {group.community_name} <br />
          소개: {group.introduce} <br />
          참여인원: {group.groupNum}
        </div>
      </div>
    </Link>
  );
}

export default GroupItem;
