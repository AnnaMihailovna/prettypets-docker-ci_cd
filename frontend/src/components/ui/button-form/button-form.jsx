import React from "react";
import styles from "./button-form.module.css";

export const ButtonForm = ({
  text = "",
  extraClass = "",
  type = "button",
  ...rest
}) => {
  return (
    <button className={`${styles.button} ${extraClass}`} type={type} {...rest}>
      <p
        className={`text text_type_large text_color_white pl-8 ${styles.text}`}
      >
        {text}
      </p>
    </button>
  );
};
