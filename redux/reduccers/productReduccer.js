// reducers/postReducer.js
const initialState = {
    productData: [],
    loading: false,
    error: null,
  };
  
  const productReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'ProductSuccess':
        return { ...state, loading: false, productData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default productReduccer;