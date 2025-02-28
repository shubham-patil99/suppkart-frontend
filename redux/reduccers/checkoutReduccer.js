// reducers/postReducer.js
const initialState = {
    addCheckout: [],
    loading: false,
    error: null,
  };
  
  const checkoutReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'checkoutSuccess':
        return { ...state, loading: false, addCheckout: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default checkoutReduccer;