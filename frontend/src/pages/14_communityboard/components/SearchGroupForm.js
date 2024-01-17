function SearchGroupForm({ setSearchQuery }) {
  return (
    <form
      name="searchGroups"
      action=""
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        setSearchQuery(e.target.where.value);
      }}
    >
      <input
        type="text"
        name="where"
        placeholder="지역명을 입력해주세요."
      ></input>
      <button type="submit">검색</button>
    </form>
  );
}

export default SearchGroupForm;
