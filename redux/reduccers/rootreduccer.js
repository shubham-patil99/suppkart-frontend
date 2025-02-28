import { combineReducers } from 'redux';
import popupsReduccer from './popupsReduccer';
import authReducer from './authReduccer';
import categoryReduccer from './categoryReduccer';
import brandReduccer from './brandReduccer';
import userDetailsReducer from './userDetailsReducer';
import categoryBySectionReduccer from './categoryBySectionReduccer';
import cartListCountReduccer from './cartListCountReduccer';
import cartWishListCountReduccer from './cartWishListCountReduccer';
import  addToCartReduccer  from './addToCartReduccer';
import getCartListReduccer from './getCartListReduccer';
import getWishListReduccer from './getWishListReduccer'
import checkoutReduccer from './checkoutReduccer';
import getProductByVarientReduccer from './getProductByVarientReduccer';
import getUserOrderReduccer from './getUserOrderReduccer';
import getUserOrderByIdReduccer from './getUserOrderIdReduccer';
import removeToWishListReduccer from './removeToWishListReduccer';
import productReduccer from './productReduccer';
import userDataReducer from './userDataReducer';
import modalReduccer from './modalReduccer';

const appReducer = combineReducers({
  // Add your reducers here
  popUpData: popupsReduccer,
  modalData:modalReduccer,
  userData: authReducer,
  userData2: userDataReducer,
  categoryData: categoryReduccer,
  productData: productReduccer,
  brandData: brandReduccer,
  userDetails: userDetailsReducer,
  categoryBySectionData:categoryBySectionReduccer,
  cartListCountData:cartListCountReduccer,
  cartWishListCountData:cartWishListCountReduccer,
  addToCartData:addToCartReduccer,
  getCartListData:getCartListReduccer,
  getWishListData:getWishListReduccer,
  addCheckout:checkoutReduccer,
  ProductByVarientData:getProductByVarientReduccer,
  userOrderData:getUserOrderReduccer,
  userOrderDataById:getUserOrderByIdReduccer,
  removeToWishListData:removeToWishListReduccer

  //   categoryData :categoryreducer,
  //   productsData :productreducer

});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    // Reset the entire state or specific slices
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;