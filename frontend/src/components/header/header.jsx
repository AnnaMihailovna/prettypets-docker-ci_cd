import React from "react";
import { useLocation, NavLink } from "react-router-dom";

import { UserContext } from "../../utils/context";
import { logoutUser } from "../../utils/api";

import loginIcon from "../../images/login.svg";
import plusIcon from "../../images/plus.svg";
import logoutIcon from "../../images/logout.svg";
import logo from "../../images/logo.svg";

import { ButtonHeader } from "../ui/button-header/button-header";
import { ButtonSecondary } from "../ui/button-secondary/button-secondary";

import styles from "./header.module.css";

export const Header = ({ setQueryPage, extraClass = "" }) => {
  const [user, setUser] = React.useContext(UserContext);

  const location = useLocation();

  const handleLogout = () => {
    logoutUser().then(() => {
      setUser({ id: "" });
      setQueryPage(1);
    });
  };

  const onMainPage = () => {
    setQueryPage(1);
  };

  const headerClassList = `${styles.header} ${
    (location.pathname === "/signin" || location.pathname === "/signup") &&
    styles.hidden
  } ${extraClass}`;

  return (
    <header className={headerClassList}>
      <NavLink className={styles.nav} to="/" onClick={onMainPage}>
        <img className={styles.logo} src={logo} alt="Логотип." />
      </NavLink>
      {!user.id ? (
        <ButtonHeader to="/signin" text="Войти" icon={loginIcon} />
      ) : (
        <div className={styles.btns_box}>
          <ButtonHeader
            to="/cats/add"
            text="Добавить кота"
            icon={plusIcon}
            isLogin={true}
          />
          <ButtonSecondary icon={logoutIcon} onClick={handleLogout} />
        </div>
      )}
    </header>
  );
};
