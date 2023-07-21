import React from "react";
import styles from "./form-container.module.css";

export const FormContainer = ({ children, extraClass = "" }) => {
  return <div className={`${styles.content} ${extraClass}`}>{children}</div>;
};
