import styles from "../CommunityInnerBoard.module.scss";

export default function NavigationButtons({
  isMember,
  onWriteClick,
  onBackClick,
}) {
  return (
    <>
      {isMember && (
        <button onClick={onWriteClick} className={styles.button}>
          작성하기
        </button>
      )}
      <button onClick={onBackClick} className={styles.button}>
        이전 페이지로
      </button>
    </>
  );
}
