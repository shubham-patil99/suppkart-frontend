// reducers/postReducer.js
const initialState = {
  newsLetterData: [],
    loading: false,
    error: null,
  };
  
  const newsLetterReduccer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'NewsLetterSuccess':
        return { ...state, loading: false, newsLetterData: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default newsLetterReduccer;