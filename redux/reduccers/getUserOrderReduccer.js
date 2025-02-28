// reducers/postReducer.js
const initialState = {
    userOrderData: [],
    loading: false,
    error: null,
  };
  
  const getUserOrderReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'UserOrderSuccess':
        return { ...state, loading: false, userOrderData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default getUserOrderReduccer;