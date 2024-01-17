// DogProfile 컴포넌트
import styles from "../ShelterBoard.module.scss";

export default function DogProfile({ dog }) {
  return (
    <div className={styles.Dog}>
      <img
        className={styles.ShelterBoardDogPic}
        src={dog.popfile}
        alt="강아지"
        title="주인을 기다리고 있어요"
      />
      <div className={styles.Profile}>
        견종: {dog.kindCd}
        <br /> 성별: {dog.sexCd}
        <br /> 나이: {dog.age}
        <br /> 구조지역: {dog.happenPlace}
        <br />
        설명: {dog.specialMark}
      </div>
    </div>
  );
}
