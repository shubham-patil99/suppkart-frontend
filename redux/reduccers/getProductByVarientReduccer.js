
const initialState = {
    ProductByVarientData: [],
    loading: false,
    error: null,
  };
  
  const getProductByVarientReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'ProductByVarientSuccess':
        return { ...state, loading: false, ProductByVarientData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default getProductByVarientReduccer;