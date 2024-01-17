// UserEditModal.js
import React, { useState } from "react";
import styles from "./UserEditModal.module.scss";

const UserEditModal = ({ onClose, onSave }) => {
  const [editedName, setEditedName] = useState("");
  const [editedIntro, setEditedIntro] = useState("");

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleIntroChange = (e) => {
    setEditedIntro(e.target.value);
  };

  const handleSave = () => {
    onSave(editedName, editedIntro);
    onClose();
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <div>
          <div className={styles.modalName}>
            <label htmlFor="editedName">반려견 이름</label>
            <br />
            <input
              type="text"
              id="editedName"
              value={editedName}
              onChange={handleNameChange}
            />
          </div>
          <div className={styles.modalIntro}>
            <label htmlFor="editedIntro">반려견 소개</label>
            <br />
            <textarea
              id="editedIntro"
              value={editedIntro}
              onChange={handleIntroChange}
            />
          </div>
          <button className={styles.modalsave} onClick={handleSave}>수정</button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
