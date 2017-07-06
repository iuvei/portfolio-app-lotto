// actions
export const login = (username) => {
  return {
    type: 'LOGGED_IN',
    username
  };
};
export const logout = (username) => {
  return {
    type: 'LOGGED_OUT',
    username
  };
};

// export const setUserName = (username) => {
//   return {
//     type: 'SET_USERNAME',
//     username
//   };
// };

export const changeLanguage = (lang) => {
  return {
    type: 'CHANGE_LANGUAGE',
    lang
  };
};
