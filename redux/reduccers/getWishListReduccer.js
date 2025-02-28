
const initialState = {
    getWishListData: [],
    loading: false,
    error: null,
  };
  
  const getWishListReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'WishListSuccess':
        return { ...state, loading: false, getWishListData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default getWishListReduccer;