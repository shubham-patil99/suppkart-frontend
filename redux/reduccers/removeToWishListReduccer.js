// reducers/postReducer.js
const initialState = {
    removeToWishListData: [],
    loading: false,
    error: null,
  };
  
  const removeToWishListReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'RemoveToWishListSuccess':
        return { ...state, loading: false, removeToWishListData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default removeToWishListReduccer;