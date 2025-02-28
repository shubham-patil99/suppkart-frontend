const OPEN_MODAL = 'OPEN_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';
const UPDATE_METADATA = 'UPDATE_METADATA';

export const showModal = (metaData,popName , isOpen) => ({
    type: popName,
    payload: metaData,
    isOpen:isOpen
});

// export const handlePopup = (data ,popName , isOpen) => {
//     return (dispatch) => {
//         dispatch(showPopup(data,popName , isOpen));
//     };
// };


export const openModal = (modalName, payload) => ({
    type: OPEN_MODAL,
    modalName,
    payload
});

export const closeModal = () => ({
    type: CLOSE_MODAL
});

export const updateMetadata = (payload) => ({
    type: UPDATE_METADATA,
    payload
});