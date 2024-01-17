// useSearch.js
import { useState, useEffect } from "react";

export function useSearch(Group, setGroup) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([...Group]);

  useEffect(() => {
    setFilteredGroups(
      Group.filter((group) => group.community_local.includes(searchQuery))
    );
  }, [searchQuery, Group]);

  const handleSearch = (e) => {
    e.preventDefault();

    const query = e.target.where.value;
    setSearchQuery(query);
  };

  return { searchQuery, setSearchQuery, filteredGroups, handleSearch };
}
