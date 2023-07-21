import React from "react";

import { getAchievements } from "../../../utils/api";

import arrowDownIcon from "../../../images/arrow-down.svg";
import arrowUpIcon from "../../../images/arrow-up.svg";
import addIcon from "../../../images/add.svg";

import { Checkbox } from "../checkbox/checkbox";
import { Input } from "../input/input";
import { Popup } from "../../popup/popup";

import styles from "./select.module.css";

export const Select = ({
  card,
  setCard,
  userAchievements,
  extraClass = "",
}) => {
  const [isOpenAchivements, setIsOpenAchivements] = React.useState(false);
  const [currentAchievements, setCurrentAchievements] = React.useState({});
  const [text, setText] = React.useState(userAchievements || "Достижения");
  const [achievementsArr, setAchievementsArr] = React.useState([]);
  const [achievementsArrToSearch, setAchievementsArrToSearch] = React.useState(
    []
  );
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [newAchievement, setNewAchievement] = React.useState("");

  const arrowIcon = isOpenAchivements ? arrowUpIcon : arrowDownIcon;

  const handleAddAchievements = (obj) => {
    if (isOpenAchivements) {
      let result = [];
      for (let key in obj) {
        if (obj[key]) {
          result.push({ achievement_name: key });
        }
      }
      setCard({ ...card, achievements: result });
    }
  };

  const handleOpenAchivements = () => {
    handleAddAchievements(currentAchievements);
    setIsOpenAchivements(!isOpenAchivements);
  };

  const onChangeAchievements = (e) => {
    setCurrentAchievements({
      ...currentAchievements,
      [e.target.name]: e.target.checked,
    });
    handleChangeText({
      ...currentAchievements,
      [e.target.name]: e.target.checked,
    });
    handleAddAchievements({
      ...currentAchievements,
      [e.target.name]: e.target.checked,
    });
  };

  const handleChangeText = (obj) => {
    let result = [];
    for (let key in obj) {
      if (obj[key]) {
        result.push(key);
      }
    }
    if (result.length) {
      setText(result.join(", "));
    } else {
      setText("Достижения");
    }
  };

  const handleSearch = (e) => {
    setAchievementsArr(
      achievementsArrToSearch.filter(
        (x) => x.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
      )
    );
  };

  const handleGetAchievements = () => {
    getAchievements().then((res) => {
      const arr = [];
      res.forEach((item) => {
        arr.push(item.achievement_name);
      });
      setAchievementsArr(arr);
      setAchievementsArrToSearch(arr);
    });
  };

  const onPopupClose = () => {
    setIsPopupOpen(false);
  };

  const onPopupOpen = () => {
    setIsPopupOpen(true);
  };

  const handleInputChange = (e) => {
    setNewAchievement(e.target.value);
  };

  const handleAddAchievement = () => {
    setAchievementsArr([...achievementsArr, newAchievement]);
    setAchievementsArrToSearch([...achievementsArrToSearch, newAchievement]);
    onPopupClose();
  };

  React.useEffect(() => {
    handleGetAchievements();
    if (userAchievements) {
      const arr = userAchievements.split(", ");
      const obj = {};
      arr.forEach((item) => {
        obj[item] = true;
      });
      setCurrentAchievements(obj);
      setText(userAchievements);
    }
  }, [userAchievements]);

  return (
    <div className={`${styles.content} ${extraClass}`}>
      <button
        onClick={handleOpenAchivements}
        type="button"
        className={styles.btn}
      >
        <p
          className={`text text_type_medium-16 text_color_${
            text === "Достижения" ? "secondary" : "primary"
          } ${styles.text}`}
        >
          {text}
        </p>
        <img className={styles.img} src={arrowIcon} alt="Открыть список." />
      </button>
      {isOpenAchivements && (
        <div className={styles.achievements_box}>
          <div className={styles.search_box}>
            <Input
              placeholder="Поиск"
              type="text"
              extraClass={styles.search_input_box}
              extraInputClass={styles.search_input}
              onChange={handleSearch}
            />
            <button className={styles.add_btn} onClick={onPopupOpen}>
              <img src={addIcon} alt="Кнопка добавления достижения." />
            </button>
          </div>
          <div className={styles.achievements_list}>
            {achievementsArr.map((item, index) => {
              return (
                <Checkbox
                  key={index}
                  name={item}
                  id={index}
                  checked={currentAchievements[item]}
                  label={item}
                  onChange={onChangeAchievements}
                />
              );
            })}
          </div>
        </div>
      )}
      {isPopupOpen && (
        <Popup
          onClose={onPopupClose}
          onChange={handleInputChange}
          onSubmit={handleAddAchievement}
        />
      )}
    </div>
  );
};
