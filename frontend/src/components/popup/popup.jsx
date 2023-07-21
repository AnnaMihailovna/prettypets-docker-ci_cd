import React from "react";

import crossIcon from "../../images/cross.svg";

import { ButtonForm } from "../ui/button-form/button-form";
import { Input } from "../ui/input/input";
import { Modal } from "../ui/modal/modal";

import styles from "./popup.module.css";

export const Popup = ({ onClose, onChange, onSubmit, extraClass = "" }) => {
  return (
    <Modal onClose={onClose}>
      <div className={`${styles.popup} ${extraClass}`}>
        <h3
          className={`text text_type_h3 text_color_primary mb-10 ${styles.title}`}
        >
          Новое достижение
        </h3>
        <Input type="text" onChange={onChange} />
        <ButtonForm
          text="Добавить"
          extraClass={styles.btn}
          onClick={onSubmit}
        />
        <button className={styles.close_btn} type="button" onClick={onClose}>
          <img src={crossIcon} alt="Кнопка закрытия." />
        </button>
      </div>
    </Modal>
  );
};
