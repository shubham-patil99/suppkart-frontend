// reducers/postReducer.js
const initialState = {
    moveToWishListData: [],
    loading: false,
    error: null,
  };
  
  const moveToWishListReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'MoveToWishListSuccess':
        return { ...state, loading: false, moveToWishListData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default moveToWishListReduccer;