import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
	recipesListReducer,
	recipesDetailsReducer,
	recipeCreateReducer,
	recipeUpdateReducer,
	recipeDeleteReducer,
	recipeTopReviewReducer,
	recipeReviewCreateReducer,
} from './recipesDucks';

import {
	userLoginReducer,
	userRegisterReducer,
	userDetailsReducer,
	userUpdateProfileReducer,
	userDeleteReducer,
	userUpdateReducer,
} from './authDucks';

import {
	marketsListReducer,
	marketsDetailsReducer,
	marketCreateReducer,
	marketUpdateReducer,
	marketDeleteReducer,
	marketTopReviewReducer,
	marketReviewCreateReducer,
} from './marketsDucks';

import {
	businessesListReducer,
	businessesDetailsReducer,
	businessCreateReducer,
	businessUpdateReducer,
	businessDeleteReducer,
	businessTopReviewReducer,
	businessReviewCreateReducer,
} from './businessesDucks';

import {
	restaurantsListReducer,
	restaurantsDetailsReducer,
	restaurantCreateReducer,
	restaurantUpdateReducer,
	restaurantDeleteReducer,
	restaurantTopReviewReducer,
	restaurantReviewCreateReducer,
} from './restaurantsDucks';

import {
	doctorListReducer,
	doctorsDetailsReducer,
	doctorCreateReducer,
	doctorUpdateReducer,
	doctorDeleteReducer,
	doctorTopReviewReducer,
	doctorReviewCreateReducer,
} from './doctorDuck';

const rootReducer = combineReducers({
	userLogin: userLoginReducer,
	userRegister: userRegisterReducer,
	userDetails: userDetailsReducer,
	userUpdateProfile: userUpdateProfileReducer,
	userDelete: userDeleteReducer,
	userUpdate: userUpdateReducer,

	recipesList: recipesListReducer,
	recipesDetails: recipesDetailsReducer,
	recipeCreate: recipeCreateReducer,
	recipeUpdate: recipeUpdateReducer,
	recipeDelete: recipeDeleteReducer,
	recipeTop: recipeTopReviewReducer,
	recipeCreateReview: recipeReviewCreateReducer,

	marketsList: marketsListReducer,
	marketsDetails: marketsDetailsReducer,
	marketsCreate: marketCreateReducer,
	marketsUpdate: marketUpdateReducer,
	marketsDelete: marketDeleteReducer,
	marketsTop: marketTopReviewReducer,
	marketsCreateReview: marketReviewCreateReducer,

	businessesList: businessesListReducer,
	businessesDetails: businessesDetailsReducer,
	businessCreate: businessCreateReducer,
	businessUpdate: businessUpdateReducer,
	businessDelete: businessDeleteReducer,
	businessTop: businessTopReviewReducer,
	businessCreateReview: businessReviewCreateReducer,

	restaurantsList: restaurantsListReducer,
	restaurantDetail: restaurantsDetailsReducer,
	restaurantCreate: restaurantCreateReducer,
	restaurantUpdate: restaurantUpdateReducer,
	restaurantDelete: restaurantDeleteReducer,
	restaurantTop: restaurantTopReviewReducer,
	restaurantReview: restaurantReviewCreateReducer,

	doctorsList: doctorListReducer,
	doctorDetail: doctorsDetailsReducer,
	doctorCreate: doctorCreateReducer,
	doctorUpdate: doctorUpdateReducer,
	doctorDelete: doctorDeleteReducer,
	doctorTop: doctorTopReviewReducer,
	doctorCreateReview: doctorReviewCreateReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
	? JSON.parse(localStorage.getItem('userInfo'))
	: null;

const initialState = {
	userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
	rootReducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
