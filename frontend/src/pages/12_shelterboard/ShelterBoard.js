import styles from "./ShelterBoard.module.scss";
import { useState, useEffect, useCallback } from "react";

import useSearchQuery from "./hooks/useSearchQuery";
import useFilteredDogs from "./hooks/useFilteredDogs";
import useDogData from "./hooks/useDogData";
import Pagination from "./hooks/Pagination";

import SearchForm from "./components/SearchForm";
import DogProfile from "./components/DogProfile";

export default function ShelterBoard() {
  const [searchQuery, updateSearchQuery] = useSearchQuery("");
  const { dogs, loading } = useDogData();
  const [currentPage, setCurrentPage] = useState(1);
  const [dogsPerPage] = useState(8);
  const indexOfLastDog = currentPage * dogsPerPage;
  const indexOfFirstDog = indexOfLastDog - dogsPerPage;
  const currentDogs = dogs.slice(indexOfFirstDog, indexOfLastDog);
  const filteredDogs = useFilteredDogs(dogs, searchQuery);
  const totalPages = Math.ceil(filteredDogs.length / dogsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filterDogsByLocation = useCallback(
    (dog) => {
      if (!dog.happenPlace) {
        return false;
      }
      return dog.happenPlace.includes(searchQuery);
    },
    [searchQuery]
  );

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.shelterHead}>
          🐶 유기견 공고
          <div className={styles.Serch}>
            <SearchForm onSubmit={(value) => updateSearchQuery(value)} />
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        </div>

        <div className={styles.showDogs}>
          {loading ? (
            <div>로딩 중...</div>
          ) : (
            currentDogs
              .filter(filterDogsByLocation)
              .map((dog) => <DogProfile dog={dog} key={dog.id} />)
          )}
        </div>
      </div>
    </>
  );
}
