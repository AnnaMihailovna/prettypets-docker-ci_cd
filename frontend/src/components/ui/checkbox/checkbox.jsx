import React from "react";
import styles from "./checkbox.module.css";

export const Checkbox = ({
  name,
  id,
  checked = false,
  label,
  onChange,
  extraClass = "",
}) => {
  const labelClassName = `text text_type_medium-16 text_color_option ${styles.label}`;

  return (
    <div className={`${styles.content} ${extraClass}`}>
      <input
        className={styles.input}
        checked={checked}
        onChange={onChange}
        type="checkbox"
        name={name}
        id={id}
      />
      <label className={labelClassName} htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
