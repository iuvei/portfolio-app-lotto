// language

const promotion = (state = {}, action) => {
  switch (action.type) {
    case 'LOAD_PROMOTION_SUCCESS':
      return Object.assign({}, state, action.promotion);
  }
  return state;
};

export default promotion;
