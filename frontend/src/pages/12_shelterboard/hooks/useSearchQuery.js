// useSearchQuery.js
import { useState } from "react";

export default function useSearchQuery(initialQuery) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const updateSearchQuery = (newQuery) => {
    setSearchQuery(newQuery);
  };

  return [searchQuery, updateSearchQuery];
}
