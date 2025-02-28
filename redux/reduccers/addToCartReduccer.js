// reducers/postReducer.js
const initialState = {
    addToCartData: [],
    loading: false,
    error: null,
  };
  
  const addToCartReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'AddToCartSuccess':
        return { ...state, loading: false, addToCartData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default addToCartReduccer;