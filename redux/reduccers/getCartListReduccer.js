
const initialState = {
    getCartListData: [],
    loading: false,
    error: null,
  };
  
  const getCartListReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'CartListSuccess':
        return { ...state, loading: false, getCartListData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default getCartListReduccer;