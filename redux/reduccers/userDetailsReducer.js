// reducers/postReducer.js
const initialState = {
    userAddress: [],
    loading: false,
    error: null,
  };
  
  const userDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'RequestSuccess':
        return { ...state, loading: false, userAddress: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default userDetailsReducer;