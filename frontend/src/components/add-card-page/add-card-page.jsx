import React from "react";
import { useHistory } from "react-router-dom";

import { sendCard } from "../../utils/api";
import { colorsList, getBase64 } from "../../utils/constants";

import returnIcon from "../../images/left.svg";
import addImgIcon from "../../images/image.svg";

import { ButtonForm } from "../ui/button-form/button-form";
import { Select } from "../ui/select/select";
import { ButtonSecondary } from "../ui/button-secondary/button-secondary";
import { Input } from "../ui/input/input";
import { ColorsBox } from "../ui/colors-box/colors-box";

import styles from "./add-card-page.module.css";

export const AddCardPage = ({ extraClass = "" }) => {
  const [currentColor, setCurrentColor] = React.useState("#FFFFFF");
  const [currentFileName, setCurrentFileName] = React.useState("");
  const [card, setCard] = React.useState({
    color: currentColor,
    achievements: [],
  });
  const [errorName, setErrorName] = React.useState("");
  const [errorAge, setErrorAge] = React.useState("");

  const history = useHistory();

  const handleReturn = () => {
    history.goBack();
  };

  const onChangeInput = (e) => {
    setCard({
      ...card,
      [e.target.name]: e.target.value,
    });
    e.target.name === "image" && setCurrentFileName(e.target.value);
  };

  const handleResponse = (res) => {
    if (typeof res.name === "object") {
      setErrorName("Поле с именем является обязательным");
    } else if (typeof res.birth_year === "object") {
      setErrorAge("Поле с годом рождения является обязательным");
    }
  };

  const handleSubmit = () => {
    errorAge && setErrorAge("");
    errorName && setErrorName("");

    const photo = document.querySelector('input[type="file"]').files[0];
    photo
      ? getBase64(photo).then((data) => {
          card["image"] = data;
          sendCard(card)
            .then((res) => {
              if (res && res.id) {
                history.push(`/cats/${res.id}`);
              }
            })
            .catch(handleResponse);
        })
      : sendCard(card)
          .then((res) => {
            if (res && res.id) {
              history.push(`/cats/${res.id}`);
            }
          })
          .catch(handleResponse);
  };

  return (
    <div className={`${styles.content} ${extraClass}`}>
      <h2 className="text text_type_h2 text_color_primary mt-25 mb-9">
        Новый кот
      </h2>
      <ButtonSecondary
        extraClass={styles.return_btn_mobile}
        icon={returnIcon}
        onClick={handleReturn}
      />
      <div className={styles.container}>
        <label htmlFor="image" className={styles.img_box}>
          <img
            className={styles.img}
            src={addImgIcon}
            alt="Добавить фото котика."
          />
          <p className="text text_type_medium-16 text_color_primary">
            {currentFileName
              ? currentFileName
              : "Загрузите фото в фотрмате JPG"}
          </p>
        </label>
        <input
          type="file"
          className={styles.file_input}
          name="image"
          id="image"
          onChange={onChangeInput}
        />
        <Input
          onChange={onChangeInput}
          name="name"
          type="text"
          placeholder="Имя кота"
          error={errorName}
        />
        <Input
          onChange={onChangeInput}
          name="birth_year"
          type="text"
          placeholder="Год рождения"
          error={errorAge}
        />
        <ColorsBox
          colorsList={colorsList}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
          card={card}
          setCard={setCard}
        />
        <Select card={card} setCard={setCard} />
        <ButtonForm
          extraClass={styles.submit_btn}
          text="Сохранить"
          onClick={handleSubmit}
        />
        <ButtonSecondary
          extraClass={styles.return_btn}
          icon={returnIcon}
          onClick={handleReturn}
        />
      </div>
    </div>
  );
};
