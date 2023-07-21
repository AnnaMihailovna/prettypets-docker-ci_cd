import React from "react";
import styles from "./colors-box.module.css";

export const ColorsBox = ({
  colorsList,
  currentColor,
  setCard,
  setCurrentColor,
  card,
  extraClass = "",
}) => {
  return (
    <div className={`${styles.colors_box} ${extraClass}`}>
      <div className={styles.colors_grid}>
        {colorsList.map((color, index) => {
          const border = color === currentColor ? "1px solid #FF5A26" : "none";
          const itemStyles = {
            backgroundColor: color,
            border: border,
          };
          return (
            <div
              key={index}
              style={itemStyles}
              className={styles.color_item}
              onClick={() => {
                setCurrentColor(color);
                setCard({ ...card, color });
              }}
            />
          );
        })}
      </div>
      <p
        className={`text text_type_medium-16 text_color_input ${styles.cat_color}`}
      >
        Цвет кота: <span className="text_color_primary">{currentColor}</span>
      </p>
    </div>
  );
};
