import React from "react";
import styles from "./button-secondary.module.css";

export const ButtonSecondary = ({
  type = "button",
  icon,
  extraClass = "",
  ...rest
}) => {
  return (
    <button className={`${styles.button} ${extraClass}`} type={type} {...rest}>
      <img
        className={styles.icon}
        src={icon}
        alt="Кнопка выхода из аккаунта."
      />
    </button>
  );
};
