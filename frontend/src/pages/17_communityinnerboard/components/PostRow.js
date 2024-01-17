import styles from "../CommunityInnerBoard.module.scss";

export default function PostRow({ post, onPostClick }) {
  return (
    <tr className={styles.pagelist} onClick={onPostClick}>
      <td className={`${styles.td} ${styles.cellWriter}`}>{post.user_id}</td>
      <td className={`${styles.td} ${styles.cellWriter}`}>{post.category}</td>
      <td className={`${styles.td} ${styles.cellTitle}`}>{post.title}</td>
    </tr>
  );
}
