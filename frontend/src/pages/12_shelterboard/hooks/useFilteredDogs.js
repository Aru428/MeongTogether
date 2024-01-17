import { useState, useEffect } from "react";

export default function useFilteredDogs(dogs, searchQuery) {
  const [filteredDogs, setFilteredDogs] = useState([]);

  useEffect(() => {
    const filtered = dogs.filter(
      (dog) => dog.happenPlace && dog.happenPlace.includes(searchQuery)
    );
    setFilteredDogs(filtered);
  }, [dogs, searchQuery]);

  return filteredDogs;
}
