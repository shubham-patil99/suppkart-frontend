// reducers/postReducer.js
const initialState = {
    data: {},
    loading: false,
    error: null,
  };
  
  const userDataReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'RequestuserSuccess':
        return { ...state, loading: false, data: action.payload , error: null };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default userDataReducer;