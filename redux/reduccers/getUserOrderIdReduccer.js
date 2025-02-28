// reducers/postReducer.js
const initialState = {
    userOrderDataById: [],
    loading: false,
    error: null,
  };
  
  const getUserOrderByIdReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'UserOrderByIdSuccess':
        return { ...state, loading: false, userOrderDataById: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default getUserOrderByIdReduccer;