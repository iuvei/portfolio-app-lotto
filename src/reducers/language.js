// language

const language = (state = null, action) => {
  switch (action.type) {
    case 'CHANGE_LANGUAGE':
      // return {
      //   ...state,
      //   action.lang.toString()
      // };
      return Object.assign({}, state, { current: action.lang.toString() });
  }
  return state;
};

export default language;
