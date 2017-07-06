// language

const locale = (state = {}, action) => {
  switch (action.type) {
    case 'LOAD_LOCALE_SUCCESS':
      return Object.assign({}, state, action.locale);
  }
  return state;
};

export default locale;
