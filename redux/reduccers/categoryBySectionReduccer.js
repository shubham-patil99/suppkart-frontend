// reducers/postReducer.js
const initialState = {
    categoryBySectionData: [],
    loading: false,
    error: null,
  };
  
  const categoryBySectionReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'CategoryBySectionSuccess':
        return { ...state, loading: false, categoryBySectionData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default categoryBySectionReduccer;