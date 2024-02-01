import React, { useEffect, useReducer } from "react";

export const AuthContext = React.createContext({
  user: {
    isPremium: null,
    email: null,
    name: null,
    token: null,
  },
  dispatch: () => {},
});

export const ACTIONS = {
  LOGIN: "login-the-user",
  LOGOUT: "logout-the-user",
  UPGRADE: "upgrade-to-premium",
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return { user: action.payload };
    case ACTIONS.LOGOUT: {
      localStorage.removeItem("user");
      return { user: null };
    }
    case ACTIONS.UPGRADE:
      return { ...state, user: { ...state.user, isPremium: true } };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    dispatch: () => {},
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({
        type: ACTIONS.LOGIN,
        payload: user,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
