import backend from '../services/apiServices';
import { logoutAction } from './authDucks';

//Types

export const GET_ALL_MARKETS_REQUEST = 'GET_ALL_MARKETS_REQUEST';
export const GET_ALL_MARKETS_SUCCESS = 'GET_ALL_MARKETS_SUCCESS';
export const GET_ALL_MARKETS_ERROR = 'GET_ALL_MARKETS_ERROR';

export const GET_MARKET_REQUEST = 'GET_MARKET_REQUEST';
export const GET_MARKET_SUCCESS = 'GET_MARKET_SUCCESS';
export const GET_MARKET_ERROR = 'GET_MARKET_ERROR';

export const CREATE_MARKET_REQUEST = 'CREATE_MARKET_REQUEST';
export const CREATE_MARKET_SUCCESS = 'CREATE_MARKET_SUCCESS';
export const CREATE_MARKET_ERROR = 'CREATE_MARKET_ERROR';
export const CREATE_MARKET_RESET = 'CREATE_MARKET_RESET';

export const UPDATE_MARKET_REQUEST = 'UPDATE_MARKET_REQUEST';
export const UPDATE_MARKET_SUCCESS = 'UPDATE_MARKET_SUCCESS';
export const UPDATE_MARKET_ERROR = 'UPDATE_MARKET_ERROR';
export const UPDATE_MARKET_RESET = 'UPDATE_MARKET_RESET';

export const DELETE_MARKET_REQUEST = 'DELETE_MARKET_REQUEST';
export const DELETE_MARKET_SUCCESS = 'DELETE_MARKET_SUCCESS';
export const DELETE_MARKET_ERROR = 'DELETE_MARKET_ERROR';

export const GET_TOP_MARKET_REQUEST = 'GET_TOP_MARKET_REQUEST';
export const GET_TOP_MARKET_SUCCESS = 'GET_TOP_MARKET';
export const GET_TOP_MARKET_ERROR = 'GET_TOP_MARKET_ERROR';

export const CREATE_REVIEW_MARKET_REQUEST = 'CREATE_REVIEW_MARKET_REQUEST';
export const CREATE_REVIEW_MARKET_SUCCESS = 'CREATE_REVIEW_MARKET';
export const CREATE_REVIEW_MARKET_ERROR = 'CREATEREVIEWMARKET_ERROR';
export const CREATE_REVIEW_MARKET_RESET = 'CREATEREVIEWMARKET_RESET';

//Reducer

export const marketsListReducer = (state = { markets: [] }, action) => {
	switch (action.type) {
		case GET_ALL_MARKETS_REQUEST:
			return { loading: true, markets: [] };
		case GET_ALL_MARKETS_SUCCESS:
			return {
				loading: false,
				markets: action.payload.markets,
				pages: action.payload.pages,
				page: action.payload.page,
			};
		case GET_ALL_MARKETS_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const marketsDetailsReducer = (state = { market: { reviews: [] } }, action) => {
	switch (action.type) {
		case GET_MARKET_REQUEST:
			return { ...state, loading: true };
		case GET_MARKET_SUCCESS:
			return { loading: false, market: action.payload };
		case GET_MARKET_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const marketCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_MARKET_REQUEST:
			return { loading: true };
		case CREATE_MARKET_SUCCESS:
			return { loading: false, success: true, market: action.payload };
		case CREATE_MARKET_ERROR:
			return { loading: false, error: action.payload };
		case CREATE_MARKET_RESET:
			return {};
		default:
			return state;
	}
};

export const marketUpdateReducer = (state = { market: {} }, action) => {
	switch (action.type) {
		case UPDATE_MARKET_REQUEST:
			return { loading: true };
		case UPDATE_MARKET_SUCCESS:
			return { loading: true, success: true, market: action.payload };
		case UPDATE_MARKET_ERROR:
			return { loading: false, error: action.payload };
		case UPDATE_MARKET_RESET:
			return {};
		default:
			return state;
	}
};

export const marketDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_MARKET_REQUEST:
			return { loading: true };
		case DELETE_MARKET_SUCCESS:
			return { loading: false, success: true };
		case DELETE_MARKET_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const marketTopReviewReducer = (state = { markets: [] }, action) => {
	switch (action.type) {
		case GET_TOP_MARKET_REQUEST:
			return { loading: true, markets: [] };
		case GET_TOP_MARKET_SUCCESS:
			return { loading: false, markets: action.payload };
		case GET_TOP_MARKET_ERROR:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const marketReviewCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_REVIEW_MARKET_REQUEST:
			return { loading: true };
		case CREATE_REVIEW_MARKET_SUCCESS:
			return { loading: false, success: true };
		case CREATE_REVIEW_MARKET_ERROR:
			return { loading: false, error: action.payload };
		case CREATE_REVIEW_MARKET_RESET:
			return {};
		default:
			return state;
	}
};
//Actions

export const listMarketsAction =
	(keyword = '', pageNumber = '') =>
	async dispatch => {
		try {
			dispatch({ type: GET_ALL_MARKETS_REQUEST });

			const { data } = await backend.get(
				`/api/markets?keyword=${keyword}&pageNumber=${pageNumber}`
			);

			dispatch({
				type: GET_ALL_MARKETS_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: GET_ALL_MARKETS_ERROR,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const listMarketsDetailsAction = id => async dispatch => {
	try {
		dispatch({
			type: GET_ALL_MARKETS_SUCCESS,
		});

		const { data } = await backend.get(`/api/markets/${id}`);

		dispatch({
			type: GET_MARKET_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_ALL_MARKETS_ERROR,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createMarketAction = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: CREATE_MARKET_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await backend.post(`/api/markets`, {}, config);

		dispatch({
			type: CREATE_MARKET_SUCCESS,
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
			type: CREATE_MARKET_ERROR,
			payload: message,
		});
	}
};

export const updateMarketAction = market => async (dispatch, getState) => {
	try {
		dispatch({
			type: UPDATE_MARKET_REQUEST,
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

		const { data } = await backend.put(`/api/markets/${market._id}`, market, config);

		dispatch({
			type: UPDATE_MARKET_SUCCESS,
			payload: data,
		});

		dispatch({
			type: GET_MARKET_SUCCESS,
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
			type: UPDATE_MARKET_ERROR,
			payload: message,
		});
	}
};

export const deleteMarketAction = id => async (dispatch, getState) => {
	try {
		dispatch({
			type: DELETE_MARKET_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		await backend.delete(`/api/markets/${id}`, config);

		dispatch({
			type: DELETE_MARKET_SUCCESS,
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
			type: DELETE_MARKET_ERROR,
			payload: message,
		});
	}
};

export const createMarketReviewAction =
	(marketId, review) => async (dispatch, getState) => {
		try {
			dispatch({
				type: CREATE_MARKET_REQUEST,
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

			await backend.post(`/api/markets/${marketId}/reviews`, review, config);

			dispatch({
				type: CREATE_REVIEW_MARKET_SUCCESS,
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
				type: CREATE_REVIEW_MARKET_ERROR,
				payload: message,
			});
		}
	};

export const listTopMarketsAction = () => async dispatch => {
	try {
		dispatch({
			type: GET_TOP_MARKET_REQUEST,
		});

		const { data } = await backend.get('/api/markets/top');

		dispatch({
			type: GET_TOP_MARKET_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_TOP_MARKET_ERROR,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
