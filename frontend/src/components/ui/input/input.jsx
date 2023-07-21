import React from "react";

import eyeIcon from "../../../images/eye.svg";
import eyeOffIcon from "../../../images/eye-off.svg";

import styles from "./input.module.css";

export const Input = ({
  extraClass = "",
  extraInputClass = "",
  type,
  id,
  error,
  ...rest
}) => {
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const customType =
    type === "password" ? (passwordOpen ? "text" : "password") : type;
  const passwordIcon = customType === "password" ? eyeOffIcon : eyeIcon;

  const handleTogglePassword = () => {
    setPasswordOpen(!passwordOpen);
  };

  return (
    <div className={`${styles.content} ${extraClass}`}>
      <input
        id={id}
        type={customType}
        className={`${styles.input} text text_type_medium-16 text_color_primary ${extraInputClass}`}
        {...rest}
      />
      {type === "password" && (
        <button
          type="button"
          className={styles.eye_btn}
          onClick={handleTogglePassword}
        >
          <img
            className={styles.eye_img}
            src={passwordIcon}
            alt="Посмотреть пароль."
          />
        </button>
      )}
      {error && (
        <span
          className={`text text_type_medium-16 text_color_red mb-4 ${styles.error}`}
        >
          {error}
        </span>
      )}
    </div>
  );
};
