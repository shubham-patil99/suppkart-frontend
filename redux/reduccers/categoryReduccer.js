// reducers/postReducer.js
const initialState = {
    categoryData: [],
    loading: false,
    error: null,
  };
  
  const categoryReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'CategorySuccess':
        return { ...state, loading: false, categoryData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default categoryReduccer;