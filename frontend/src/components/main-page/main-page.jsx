import React from "react";

import { getCards } from "../../utils/api";

import { MainCard } from "../main-card/main-card";
import { PaginationBox } from "../pagination-box/pagination-box";

import styles from "./main-page.module.css";

export const MainPage = ({ queryPage, setQueryPage, extraClass = "" }) => {
  const [cards, setCards] = React.useState([]);
  const [pagData, setPagData] = React.useState({});

  React.useEffect(() => {
    getCards(queryPage)
      .then((res) => {
        setPagData({
          count: res.count,
          pages: Math.ceil(res.count / 10),
        });
        setCards(res.results);
      })
      .catch((err) => {
        if (err.detail === "Invalid page.") {
          getCards(queryPage - 1)
            .then((res) => {
              setQueryPage(queryPage - 1);
              setPagData({
                count: res.count,
                pages: Math.ceil(res.count / 10),
              });
              setCards(res.results);
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          console.error(err);
        }
      });
  }, [queryPage, setQueryPage]);

  return (
    <section className={`${styles.content} ${extraClass}`}>
      <h2
        className={`text text_type_h2 text_color_primary mt-25 mb-20 ${styles.title}`}
      >
        Замечательные коты
      </h2>
      <div className={styles.box}>
        {cards.map((item, index) => {
          return (
            <MainCard
              cardId={item.id}
              key={index}
              img={item.image}
              name={item.name}
              date={item.birth_year}
              color={item.color}
            />
          );
        })}
      </div>
      {pagData.count > 10 && (
        <PaginationBox
          data={pagData}
          queryPage={queryPage}
          setQueryPage={setQueryPage}
        />
      )}
    </section>
  );
};
