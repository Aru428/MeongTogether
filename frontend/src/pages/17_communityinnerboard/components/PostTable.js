import styles from "../CommunityInnerBoard.module.scss";

import PostRow from "./PostRow";

export default function PostTable({ posts, onPostClick }) {
  return (
    <table className={styles.boardTable}>
      <thead>
        <tr className={styles.thead}>
          <th className={`${styles.th}`}>작성자</th>
          <th className={`${styles.th}`}>유형</th>
          <th className={`${styles.th}`}>글 제목</th>
        </tr>
      </thead>
      <tbody>
        <tr className={styles.tspace}></tr>
        {posts.map((post, index) => (
          <PostRow
            post={post}
            key={index}
            onPostClick={() => onPostClick(index + 1)}
          />
        ))}
      </tbody>
    </table>
  );
}
