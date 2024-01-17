// SearchForm 컴포넌트

import styles from "../ShelterBoard.module.scss";

export default function SearchForm({ updateSearchQuery }) {
  return (
    <div className={styles.Serch}>
      <form
        name="searchDogs"
        action=""
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          updateSearchQuery(e.target.where.value);
        }}
      >
        <input
          type="text"
          name="where"
          placeholder="지역명을 입력해주세요."
        ></input>
        <button type="submit">검색</button>
      </form>
    </div>
  );
}
