// reducers/postReducer.js
const initialState = {
    popupdata: {},
    isOpen: false,
    popUpName:"",
    loading: false,
};

const popupsReduccer = (state = initialState, action) => {
    switch (action.type) {
        case action.type:
            return { ...state, isOpen: action.isOpen ,popUpName:action.type ,popupdata:action?.payload };
        default:
            return state
    }
};

export default popupsReduccer;
