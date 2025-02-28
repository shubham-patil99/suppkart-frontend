// reducers/postReducer.js
const initialState = {
    brandData: [],
    loading: false,
    error: null,
  };
  
  const brandReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'BrandSuccess':
        return { ...state, loading: false, brandData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default brandReduccer;