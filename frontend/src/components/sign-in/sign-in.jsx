import React from "react";
import { useHistory, NavLink } from "react-router-dom";

import { getUser, loginUser } from "../../utils/api";
import { UserContext } from "../../utils/context";

import logoIcon from "../../images/logo.svg";

import { FormContainer } from "../ui/form-container/form-container";
import { Input } from "../ui/input/input";
import { ButtonForm } from "../ui/button-form/button-form";

import styles from "./sign-in.module.css";

export const SignIn = ({ extraClass = "" }) => {
  const [userData, setUserData] = React.useState({});
  const [user, setUser] = React.useContext(UserContext);
  const [errorPassword, setErrorPassword] = React.useState("");
  const [errorLogin, setErrorLogin] = React.useState("");

  const history = useHistory();

  const onChangeInput = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const checkValid = () => {
    if (!userData.username) {
      setErrorLogin("Поле с именем является обязательным");
      return false;
    }
    if (!userData.password) {
      setErrorPassword("Поле с паролем является обязательным");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    errorLogin && setErrorLogin("");
    errorPassword && setErrorPassword("");

    checkValid() &&
      loginUser(userData.username, userData.password)
        .then((res) => {
          if (res && res.auth_token) {
            getUser().then((res) => {
              if (res && res.id) {
                setUser({ id: res.id });
                history.replace({ pathname: "/" });
              }
            });
          }
        })
        .catch((err) => {
          if (err.non_field_errors) {
            setErrorPassword("Неправильный логин или пароль");
          } else {
            setErrorPassword("Ошибка сервера");
          }
        });
  };

  return (
    <section className={`${styles.content} ${extraClass}`}>
      <img className={`${styles.logo} mb-16`} src={logoIcon} alt="Логотип" />
      <h1
        className={`text text_type_h1 text_color_primary mb-10 ${styles.title}`}
      >
        Вход
      </h1>
      <p
        className={`text text_type_medium-20 text_color_input mb-20 ${styles.subtitle}`}
      >
        Войдите для доступа к Kittygram!
      </p>
      <FormContainer>
        <form className={styles.form}>
          <Input
            name="username"
            type="text"
            id={1}
            placeholder="Имя"
            onChange={onChangeInput}
            error={errorLogin}
          />
          <Input
            name="password"
            type="password"
            id={2}
            placeholder="Пароль"
            onChange={onChangeInput}
            error={errorPassword}
          />
          <ButtonForm
            extraClass={styles.btn}
            text="Войти"
            onClick={handleSubmit}
          />
          <p className="text text_type_small text_color_input mt-5 mb-5">или</p>
        </form>
        <div className={styles.footer}>
          <NavLink
            to="/signup"
            className={`text text_type_medium-16 text_color_link ${styles.nav}`}
          >
            Ещё не зарегистрированы? Зарегистрируйтесь
          </NavLink>
        </div>
      </FormContainer>
    </section>
  );
};
