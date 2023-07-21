import React from "react";
import ReactDOM from "react-dom";

import styles from "./modal.module.css";

const modalRoot = document.getElementById("react-modals");

export const Modal = ({ children, onClose, extraClass = "" }) => {
  return ReactDOM.createPortal(
    <>
      <div className={`${styles.content} ${extraClass}`}>{children}</div>
      <div className={styles.overlay} onClick={onClose} />
    </>,
    modalRoot
  );
};
