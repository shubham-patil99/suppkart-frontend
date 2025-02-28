// reducers/postReducer.js
const initialState = {
    userDetails: {},
    loading: false,
    error: null,
    token: "",
    cart:[],
    wishlist:[]
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, userDetails: action.payload?.user , token : action.payload?.token, error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default authReducer;