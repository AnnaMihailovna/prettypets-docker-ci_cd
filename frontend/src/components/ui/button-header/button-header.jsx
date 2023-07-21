import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./button-header.module.css";

export const ButtonHeader = ({
  isLogin = false,
  text = "",
  icon,
  to = "/signin",
  extraClass = "",
  ...rest
}) => {
  return (
    <NavLink to={to} className={`${styles.button} ${extraClass}`} {...rest}>
      <img className={styles.icon} src={icon} alt="Иконка." />
      <p
        className={`text text_type_large text_color_white pl-8 ${styles.text} ${
          !text && styles.none
        } ${isLogin && styles.hidden}`}
      >
        {text}
      </p>
    </NavLink>
  );
};
