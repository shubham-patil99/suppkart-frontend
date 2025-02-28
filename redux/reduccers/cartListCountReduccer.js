// reducers/postReducer.js
const initialState = {
    cartListCountData: [],
    loading: false,
    error: null,
  };
  
  const cartListCountReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'CartListCountSuccess':
        return { ...state, loading: false, cartListCountData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default cartListCountReduccer;