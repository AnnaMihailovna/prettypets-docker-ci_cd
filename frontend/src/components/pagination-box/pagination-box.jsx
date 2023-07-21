import React from "react";

import arrowLeftIcon from "../../images/arrow-left.svg";
import arrowRightIcon from "../../images/arrow-right.svg";

import styles from "./pagination-box.module.css";

export const PaginationBox = ({
  data,
  queryPage,
  setQueryPage,
  extraClass = "",
}) => {
  const [buttons, setButtons] = React.useState([]);

  const onPrevClick = () => {
    if (queryPage > 1) {
      setQueryPage(queryPage - 1);
    }
  };

  const onNextClick = () => {
    if (queryPage < data.pages) {
      setQueryPage(queryPage + 1);
    }
  };

  const onPageClick = (e) => {
    const btn = e.target.closest("button");
    if (btn && btn.name !== queryPage) {
      setQueryPage(+btn.name);
    }
  };

  React.useEffect(() => {
    const res = [];
    if (data.pages < 6) {
      for (let i = 1; i <= data.pages; i++) {
        res.push(i);
      }
    } else {
      if (queryPage === 1) {
        res.push(1);
        res.push(2);
        res.push("...");
        res.push(data.pages);
      } else if (queryPage === 2 || queryPage === 3) {
        res.push(1);
        res.push(2);
        res.push(3);
        res.push("...");
        res.push(data.pages);
      } else if (queryPage === data.pages - 2 || queryPage === data.pages - 1) {
        res.push(1);
        res.push("...");
        res.push(data.pages - 2);
        res.push(data.pages - 1);
        res.push(data.pages);
      } else if (queryPage === data.pages) {
        res.push(1);
        res.push("...");
        res.push(data.pages - 1);
        res.push(data.pages);
      } else {
        res.push(1);
        res.push("...");
        res.push(queryPage);
        res.push("...");
        res.push(data.pages);
      }
    }

    setButtons(res);
  }, [data, queryPage]);

  return (
    <div className={`${styles.content} ${extraClass}`}>
      <button
        className={styles.btn}
        type="button"
        onClick={onPrevClick}
        disabled={queryPage === 1}
      >
        <img src={arrowLeftIcon} alt="Предыдущая страница." />
      </button>
      <div className={styles.btn_box}>
        {buttons.map((item, index) => {
          const isActive = queryPage === item;
          const textWeight = isActive ? 600 : 500;
          const textColor = isActive ? "primary" : "additional";
          const btnName = item !== "..." ? item : "";

          return (
            <button
              key={index}
              name={btnName}
              className={styles.num_btn}
              type="button"
              onClick={onPageClick}
              disabled={isActive || item === "..."}
            >
              <p
                className={`text text_type_medium text_color_${textColor}`}
                style={{ fontWeight: textWeight, letterSpacing: "0.2px" }}
              >
                {item}
              </p>
            </button>
          );
        })}
      </div>
      <button
        className={styles.btn}
        type="button"
        onClick={onNextClick}
        disabled={queryPage === data.pages}
      >
        <img src={arrowRightIcon} alt="Следующая страница." />
      </button>
    </div>
  );
};
