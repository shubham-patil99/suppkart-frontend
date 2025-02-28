// Define action types
const OPEN_MODAL = 'OPEN_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';
const UPDATE_METADATA = 'UPDATE_METADATA';

// Initial state
const initialState = {
    metaData: {},
    modalError: {},
    isOpen: false,
    modalName: "",
};

// Reducer function
const modalReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_MODAL:
            return { 
                ...state, 
                isOpen: true, 
                modalName: action.modalName,
                metaData: action.payload
            };
        case CLOSE_MODAL:
            return { 
                ...state, 
                isOpen: false, 
                modalName: "",
                metaData: {}
            };
        case UPDATE_METADATA:
            return { 
                ...state, 
                modalError: action.payload
            };
        default:
            return state;
    }
};

export default modalReducer;
