import React from "react";
import styles from "./footer.module.css";

export const Footer = ({ extraClass = "" }) => {
  return (
    <footer className={`${styles.footer} ${extraClass}`}>
      <p
        className={`text text_type_medium-20 text_color_input ${styles.text}`}
      >{`Kittygram ${new Date().getFullYear()}`}</p>
    </footer>
  );
};
