// reducers/postReducer.js
const initialState = {
    cartWishListCountData: [],
    loading: false,
    error: null,
  };
  
  const cartWishListCountReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'CartWishListCountSuccess':
        return { ...state, loading: false, cartWishListCountData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default cartWishListCountReduccer;