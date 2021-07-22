import backend from '../services/apiServices';

import { logoutAction } from './authDucks';

//Types

export const GET_ALL_RESTAURANTS_REQUEST = 'GET_ALL_RESTAURANTS_REQUEST';
export const GET_ALL_RESTAURANTS_SUCCESS = 'GET_ALL_RESTAURANTS';
export const GET_ALL_RESTAURANTS_ERROR = 'GET_ALL_RESTAURANTS_ERROR';

export const GET_RESTAURANT_REQUEST = 'GET_RESTAURANT_REQUEST';
export const GET_RESTAURANT_SUCCESS = 'GET_ALL_RESTAURANT';
export const GET_RESTAURANT_ERROR = 'GET_RESTAURANT_ERROR';

export const CREATE_RESTAURANT_REQUEST = 'CREATE_RESTAURANT_REQUEST';
export const CREATE_RESTAURANT_SUCCESS = 'CREATE_RESTAURANT';
export const CREATE_RESTAURANT_ERROR = 'CREATE_RESTAURANT_ERROR';
export const CREATE_RESTAURANT_RESET = 'CREATE_RESTAURANT_RESET';

export const UPDATE_RESTAURANT_REQUEST = 'UPDATE_RESTAURANT_REQUEST';
export const UPDATE_RESTAURANT_SUCCESS = 'UPDATE_RESTAURANT';
export const UPDATE_RESTAURANT_ERROR = 'UPDATE_RESTAURANT_ERROR';
export const UPDATE_RESTAURANT_RESET = 'UPDATE_RESTAURANT_RESET';

export const DELETE_RESTAURANT_REQUEST = 'DELETE_RESTAURANT_REQUEST';
export const DELETE_RESTAURANT_SUCCESS = 'DELETE_RESTAURANT';
export const DELETE_RESTAURANT_ERROR = 'DELETE_RESTAURANT_ERROR';

export const GET_TOP_RESTAURANT_REQUEST = 'GETTOPRESTAURANT_REQUEST';
export const GET_TOP_RESTAURANT_SUCCESS = 'GET_TOP_RESTAURANT';
export const GET_TOP_RESTAURANT_ERROR = 'GET_TOP_RESTAURANT_ERROR';

export const CREATE_RESTAURANT_REVIEW_REQUEST = 'CREATERESTAURANTREVIEW_REQUEST';
export const CREATE_RESTAURANT_REVIEW_SUCCESS = 'CREATERESTAURANTREVIEW';
export const CREATE_RESTAURANT_REVIEW_ERROR = 'CREATERESTAURANTREVIEW_ERROR';
export const CREATE_RESTAURANT_REVIEW_RESET = 'CREATERESTAURANTREVIEW_RESET';

//Reducer

export const restaurantsListReducer = (state = { restaurants: [] }, action) => {
	switch (action.type) {
		case GET_ALL_RESTAURANTS_REQUEST:
			return { loading: true, restaurants: [] };
		case GET_ALL_RESTAURANTS_SUCCESS:
			return {
				loading: false,
				restaurants: action.payload.restaurants,
				pages: action.payload.pages,
				page: action.payload.page,
			};
		case GET_ALL_RESTAURANTS_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const restaurantsDetailsReducer = (
	state = { restaurant: { reviews: [] } },
	action
) => {
	switch (action.type) {
		case GET_RESTAURANT_REQUEST:
			return { ...state, loading: true };
		case GET_RESTAURANT_SUCCESS:
			return { loading: false, restaurant: action.payload };
		case GET_RESTAURANT_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const restaurantCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_RESTAURANT_REQUEST:
			return { loading: true };
		case CREATE_RESTAURANT_SUCCESS:
			return { loading: false, success: true, restaurant: action.payload };
		case CREATE_RESTAURANT_ERROR:
			return { loading: false, error: action.payload };
		case CREATE_RESTAURANT_RESET:
			return {};
		default:
			return state;
	}
};

export const restaurantUpdateReducer = (state = { restaurant: {} }, action) => {
	switch (action.type) {
		case UPDATE_RESTAURANT_REQUEST:
			return { loading: true };
		case UPDATE_RESTAURANT_SUCCESS:
			return { loading: true, success: true, restaurant: action.payload };
		case UPDATE_RESTAURANT_ERROR:
			return { loading: false, error: action.payload };
		case UPDATE_RESTAURANT_RESET:
			return {};
		default:
			return state;
	}
};

export const restaurantDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_RESTAURANT_REQUEST:
			return { loading: true };
		case DELETE_RESTAURANT_SUCCESS:
			return { loading: false, success: true };
		case DELETE_RESTAURANT_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const restaurantTopReviewReducer = (state = { restaurants: [] }, action) => {
	switch (action.type) {
		case GET_TOP_RESTAURANT_REQUEST:
			return { loading: true, restaurants: [] };
		case GET_TOP_RESTAURANT_SUCCESS:
			return { loading: false, restaurants: action.payload };
		case GET_TOP_RESTAURANT_ERROR:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const restaurantReviewCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_RESTAURANT_REVIEW_REQUEST:
			return { loading: true };
		case CREATE_RESTAURANT_REVIEW_SUCCESS:
			return { loading: false, success: true };
		case CREATE_RESTAURANT_REVIEW_ERROR:
			return { loading: false, error: action.payload };
		case CREATE_RESTAURANT_REVIEW_RESET:
			return {};
		default:
			return state;
	}
};
//Actions

export const listRestaurantsAction =
	(keyword = '', pageNumber = '') =>
	async dispatch => {
		try {
			dispatch({ type: GET_ALL_RESTAURANTS_REQUEST });

			const { data } = await backend.get(
				`/api/restaurants?keyword=${keyword}&pageNumber=${pageNumber}`
			);

			dispatch({
				type: GET_ALL_RESTAURANTS_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: GET_ALL_RESTAURANTS_ERROR,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const listRestaurantsDetailsAction = id => async dispatch => {
	try {
		dispatch({
			type: GET_RESTAURANT_REQUEST,
		});

		const { data } = await backend.get(`/api/restaurants/${id}`);

		dispatch({
			type: GET_RESTAURANT_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_ALL_RESTAURANTS_ERROR,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createRestaurantAction = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: CREATE_RESTAURANT_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await backend.post(`/api/restaurants`, {}, config);

		dispatch({
			type: CREATE_RESTAURANT_SUCCESS,
			payload: data,
		});
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		if (message === 'You cannot PASS!!') {
			dispatch(logoutAction());
		}
		dispatch({
			type: CREATE_RESTAURANT_ERROR,
			payload: message,
		});
	}
};

export const updateRestaurantAction = restaurant => async (dispatch, getState) => {
	try {
		dispatch({
			type: UPDATE_RESTAURANT_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await backend.put(
			`/api/restaurants/${restaurant._id}`,
			restaurant,
			config
		);

		dispatch({
			type: UPDATE_RESTAURANT_SUCCESS,
			payload: data,
		});

		dispatch({
			type: GET_RESTAURANT_SUCCESS,
			payload: data,
		});
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		if (message === 'You cannot PASS!!') {
			dispatch(logoutAction());
		}
		dispatch({
			type: UPDATE_RESTAURANT_ERROR,
			payload: message,
		});
	}
};

export const deleteRestaurantAction = id => async (dispatch, getState) => {
	try {
		dispatch({
			type: DELETE_RESTAURANT_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		await backend.delete(`/api/restaurants/${id}`, config);

		dispatch({
			type: DELETE_RESTAURANT_SUCCESS,
		});
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		if (message === 'You cannot PASS!!') {
			dispatch(logoutAction());
		}
		dispatch({
			type: DELETE_RESTAURANT_ERROR,
			payload: message,
		});
	}
};

export const createRestaurantReviewAction =
	(restaurantId, review) => async (dispatch, getState) => {
		try {
			dispatch({
				type: CREATE_RESTAURANT_REVIEW_REQUEST,
			});

			const {
				userLogin: { userInfo },
			} = getState();

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userInfo.token}`,
				},
			};

			await backend.post(
				`/api/restaurants/${restaurantId}/reviews`,
				review,
				config
			);

			dispatch({
				type: CREATE_RESTAURANT_REVIEW_SUCCESS,
			});
		} catch (error) {
			const message =
				error.response && error.response.data.message
					? error.response.data.message
					: error.message;
			if (message === 'You cannot PASS!!') {
				dispatch(logoutAction());
			}
			dispatch({
				type: CREATE_RESTAURANT_REVIEW_ERROR,
				payload: message,
			});
		}
	};

export const listTopRestaurantsAction = () => async dispatch => {
	try {
		dispatch({
			type: GET_TOP_RESTAURANT_REQUEST,
		});

		const { data } = await backend.get('/api/restaurants/top');

		dispatch({
			type: GET_TOP_RESTAURANT_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_TOP_RESTAURANT_ERROR,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
