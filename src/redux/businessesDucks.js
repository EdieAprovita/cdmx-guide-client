import backend from '../services/apiServices';
import { logoutAction } from './authDucks';

//Types

export const GET_ALL_BUSINESSES_REQUEST = 'GET_ALL_BUSINESSES_REQUEST';
export const GET_ALL_BUSINESSES_SUCCESS = 'GET_ALL_BUSINESS_SUCCESS';
export const GET_ALL_BUSINESSES_ERROR = 'GET_ALL_BUSINESSES_ERROR';

export const GET_BUSINESS_REQUEST = 'GET_ALL_BUSINESS_REQUEST';
export const GET_BUSINESS_SUCCESS = 'GET_ALL_BUSINESS';
export const GET_BUSINESS_ERROR = 'GET_BUSINESS_ERROR';

export const CREATE_BUSINESS_REQUEST = 'CREATE_BUSINESS_REQUEST';
export const CREATE_BUSINESS_SUCCESS = 'CREATE_BUSINESS_SUCCESS';
export const CREATE_BUSINESS_ERROR = 'CREATE_BUSINESS_ERROR';
export const CREATE_BUSINESS_RESET = 'CREATE_BUSINESS_RESET';

export const UPDATE_BUSINESS_REQUEST = 'UPDATE_BUSINESS_REQUEST';
export const UPDATE_BUSINESS_SUCCESS = 'UPDATE_BUSINESS_SUCCESS';
export const UPDATE_BUSINESS_ERROR = 'UPDATE_BUSINESS_ERROR';
export const UPDATE_BUSINESS_RESET = 'UPDATE_BUSINESS_RESET';

export const DELETE_BUSINESS_REQUEST = 'DELETE_BUSINESS_REQUEST';
export const DELETE_BUSINESS_SUCCESS = 'DELETE_BUSINESS_SUCCESS';
export const DELETE_BUSINESS_ERROR = 'DELETE_BUSINESS_ERROR';

export const GET_TOP_BUSINESS_REQUEST = 'GET_TOP_BUSINESS_REQUEST';
export const GET_TOP_BUSINESS_SUCCESS = 'GET_TOP_BUSINESS_SUCCESS';
export const GET_TOP_BUSINESS_ERROR = 'GET_TOP_BUSINESS_ERROR';

export const CREATE_BUSINESS_REVIEW_REQUEST = 'CREATE_BUSINESS_REVIEW_REQUEST';
export const CREATE_BUSINESS_REVIEW = 'CREATE_BUSINESS_REVIEW';
export const CREATE_BUSINESS_REVIEW_ERROR = 'CREATE_BUSINESS_REVIEW_ERROR';
export const CREATE_BUSINESS_REVIEW_RESET = 'CREATE_BUSINESS_REVIEW_RESET';

//Reducer

export const businessesListReducer = (state = { businesses: [] }, action) => {
	switch (action.type) {
		case GET_ALL_BUSINESSES_REQUEST:
			return { loading: true, businesses: [] };
		case GET_ALL_BUSINESSES_SUCCESS:
			return {
				loading: false,
				businesses: action.payload.businesses,
				pages: action.payload.pages,
				page: action.payload.page,
			};
		case GET_ALL_BUSINESSES_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const businessesDetailsReducer = (
	state = { business: { reviews: [] } },
	action
) => {
	switch (action.type) {
		case GET_BUSINESS_REQUEST:
			return { ...state, loading: true };
		case GET_BUSINESS_SUCCESS:
			return { loading: false, business: action.payload };
		case GET_BUSINESS_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const businessCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_BUSINESS_REQUEST:
			return { loading: true };
		case CREATE_BUSINESS_SUCCESS:
			return { loading: false, success: true, business: action.payload };
		case CREATE_BUSINESS_ERROR:
			return { loading: false, error: action.payload };
		case CREATE_BUSINESS_RESET:
			return {};
		default:
			return state;
	}
};

export const businessUpdateReducer = (state = { business: {} }, action) => {
	switch (action.type) {
		case UPDATE_BUSINESS_REQUEST:
			return { loading: true };
		case UPDATE_BUSINESS_SUCCESS:
			return { loading: true, success: true, business: action.payload };
		case UPDATE_BUSINESS_ERROR:
			return { loading: false, error: action.payload };
		case UPDATE_BUSINESS_RESET:
			return {};
		default:
			return state;
	}
};

export const businessDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_BUSINESS_REQUEST:
			return { loading: true };
		case DELETE_BUSINESS_SUCCESS:
			return { loading: false, success: true };
		case DELETE_BUSINESS_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const businessTopReviewReducer = (state = { businesses: [] }, action) => {
	switch (action.type) {
		case GET_TOP_BUSINESS_REQUEST:
			return { loading: true, businesses: [] };
		case GET_TOP_BUSINESS_SUCCESS:
			return { loading: false, businesses: action.payload };
		case GET_TOP_BUSINESS_ERROR:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const businessReviewCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_BUSINESS_REVIEW_REQUEST:
			return { loading: true };
		case CREATE_BUSINESS_REVIEW:
			return { loading: false, success: true };
		case CREATE_BUSINESS_REVIEW_ERROR:
			return { loading: false, error: action.payload };
		case CREATE_BUSINESS_RESET:
			return {};
		default:
			return state;
	}
};

//Actions

export const listBusinessesAction =
	(keyword = '', pageNumber = '') =>
	async dispatch => {
		try {
			dispatch({ type: GET_ALL_BUSINESSES_REQUEST });

			const { data } = await backend.get(
				`/api/businesses?keyword=${keyword}&pageNumber=${pageNumber}`
			);

			dispatch({
				type: GET_ALL_BUSINESSES_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: GET_ALL_BUSINESSES_ERROR,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const listBusinessesDetailsAction = id => async dispatch => {
	try {
		dispatch({
			type: GET_ALL_BUSINESSES_SUCCESS,
		});

		const { data } = await backend.get(`/api/businesses/${id}`);

		dispatch({
			type: GET_BUSINESS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_ALL_BUSINESSES_ERROR,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createBusinessAction = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: CREATE_BUSINESS_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await backend.post(`/api/businesses`, {}, config);

		dispatch({
			type: CREATE_BUSINESS_SUCCESS,
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
			type: CREATE_BUSINESS_ERROR,
			payload: message,
		});
	}
};

export const updateBusinessAction = business => async (dispatch, getState) => {
	try {
		dispatch({
			type: UPDATE_BUSINESS_REQUEST,
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
			`/api/businesses/${business._id}`,
			business,
			config
		);

		dispatch({
			type: UPDATE_BUSINESS_SUCCESS,
			payload: data,
		});

		dispatch({
			type: GET_BUSINESS_SUCCESS,
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
			type: UPDATE_BUSINESS_ERROR,
			payload: message,
		});
	}
};

export const deleteBusinessAction = id => async (dispatch, getState) => {
	try {
		dispatch({
			type: DELETE_BUSINESS_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		await backend.delete(`/api/businesses/${id}`, config);

		dispatch({
			type: DELETE_BUSINESS_SUCCESS,
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
			type: DELETE_BUSINESS_ERROR,
			payload: message,
		});
	}
};

export const createBusinessReviewAction =
	(businessId, review) => async (dispatch, getState) => {
		try {
			dispatch({
				type: CREATE_BUSINESS_REVIEW_REQUEST,
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

			await backend.post(`/api/businesses/${businessId}/reviews`, review, config);

			dispatch({
				type: CREATE_BUSINESS_REVIEW,
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
				type: CREATE_BUSINESS_REVIEW_ERROR,
				payload: message,
			});
		}
	};

export const listTopBusinessesAction = () => async dispatch => {
	try {
		dispatch({
			type: GET_TOP_BUSINESS_REQUEST,
		});

		const { data } = await backend.get('/api/businesses/top');

		dispatch({
			type: GET_TOP_BUSINESS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_TOP_BUSINESS_ERROR,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
