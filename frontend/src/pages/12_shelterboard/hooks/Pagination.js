import styles from "../ShelterBoard.module.scss";

export default function Pagination({
  currentPage,
  totalPages,
  prevPage,
  nextPage,
}) {
  return (
    <div className={styles.pagination}>
      <button onClick={prevPage}>{"◀ "}이전</button>
      <span>{currentPage}</span>
      <button onClick={nextPage}>다음{" ▶"}</button>
    </div>
  );
}
