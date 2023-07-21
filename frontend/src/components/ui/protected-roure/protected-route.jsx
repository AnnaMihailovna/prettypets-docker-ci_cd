import React from "react";
import { Route, Redirect } from "react-router-dom";

export const ProtectedRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() =>
        localStorage.getItem("auth_token") ? (
          children
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
};
