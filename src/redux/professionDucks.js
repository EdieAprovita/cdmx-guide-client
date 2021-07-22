import api from '../services/apiServices';

import { logoutAction } from './authDucks';

//Types

export const GET_ALL_PROFESSIONS_REQUEST = 'GET_ALL_PROFESSIONS_REQUEST';
export const GET_ALL_PROFESSIONS_SUCCESS = 'GET_ALL_PROFESSIONS_SUCCESS';
export const GET_ALL_PROFESSIONS_ERROR = 'GET_ALL_PROFESSIONS_ERROR';

export const GET_PROFESSION_REQUEST = 'GET_PROFESSION_REQUEST';
export const GET_PROFESSION_SUCCESS = 'GET_PROFESSION_SUCCESS';
export const GET_PROFESSION_ERROR = 'GET_PROFESSION_ERROR';

export const CREATE_PROFESSION_REQUEST = 'CREATE_PROFESSION_REQUEST';
export const CREATE_PROFESSION_SUCCESS = 'CREATE_PROFESSION_SUCCESS';
export const CREATE_PROFESSION_RESET = 'CREATE_PROFESSION_RESET';
export const CREATE_PROFESSION_ERROR = 'CREATE_PROFESSION_ERROR';

export const UPDATE_PROFESSION_REQUEST = 'UPDATE_PROFESSION_REQUEST';
export const UPDATE_PROFESSION_SUCCESS = 'UPDATE_PROFESSION_SUCCESS';
export const UPDATE_PROFESSION_RESET = 'UPDATE_PROFESSION_RESET';
export const UPDATE_PROFESSION_ERROR = 'UPDATE_PROFESSION_ERROR';

export const DELETE_PROFESSION_REQUEST = 'DELETE_PROFESSION_REQUEST';
export const DELETE_PROFESSION_SUCCESS = 'DELETE_PROFESSION_SUCCESS';
export const DELETE_PROFESSION_ERROR = 'DELETE_PROFESSION_ERROR';

export const GET_TOP_PROFESSION_REQUEST = 'GET_TOP_PROFESSION_REQUEST';
export const GET_TOP_PROFESSION_SUCCESS = 'GET_TOP_PROFESSION_SUCCESS';
export const GET_TOP_PROFESSION_ERROR = 'GET_TOP_PROFESSION_ERROR';

export const CREATE_REVIEW_PROFESSION_REQUEST = 'CREATE_REVIEW_PROFESSION_REQUEST';
export const CREATE_REVIEW_PROFESSION_SUCCESS = 'CREATE_REVIEW_PROFESSION_SUCCESS';
export const CREATE_REVIEW_PROFESSION_ERROR = 'CREATEREVIEWPROFESSION_ERROR';
export const CREATE_REVIEW_PROFESSION_RESET = 'CREATEREVIEWPROFESSION_RESET';

//Reducer

export const professionsListReducer = (state = { professions: [] }, action) => {
	switch (action.type) {
		case GET_ALL_PROFESSIONS_REQUEST:
			return { ...state, loading: true, professions: [] };
		case GET_ALL_PROFESSIONS_SUCCESS:
			return {
				loading: false,
				professions: action.payload.professions,
				pages: action.payload.pages,
				page: action.payload.page,
			};
		case GET_ALL_PROFESSIONS_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const professionsDetailsReducer = (
	state = { doctor: { reviews: [] } },
	action
) => {
	switch (action.type) {
		case GET_PROFESSION_REQUEST:
			return { ...state, loading: true };
		case GET_PROFESSION_SUCCESS:
			return { loading: false, doctor: action.payload };
		case GET_PROFESSION_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const professionCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_PROFESSION_REQUEST:
			return { loading: true };
		case CREATE_PROFESSION_SUCCESS:
			return { loading: false, success: true, doctor: action.payload };
		case CREATE_PROFESSION_ERROR:
			return { loading: false, error: action.payload };
		case CREATE_PROFESSION_RESET:
			return {};
		default:
			return state;
	}
};

export const professionUpdateReducer = (state = { doctor: {} }, action) => {
	switch (action.type) {
		case UPDATE_PROFESSION_REQUEST:
			return { loading: true };
		case UPDATE_PROFESSION_SUCCESS:
			return { loading: false, success: true, doctor: action.payload };
		case UPDATE_PROFESSION_ERROR:
			return { loading: false, error: action.payload };
		case UPDATE_PROFESSION_RESET:
			return {};
		default:
			return state;
	}
};

export const professionDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_PROFESSION_REQUEST:
			return { loading: true };
		case DELETE_PROFESSION_SUCCESS:
			return { loading: false, professions: action.payload };
		case DELETE_PROFESSION_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const professionTopReviewReducer = (state = { professions: [] }, action) => {
	switch (action.type) {
		case GET_TOP_PROFESSION_REQUEST:
			return { loading: true };
		case GET_TOP_PROFESSION_SUCCESS:
			return { loading: false, professions: [] };
		case GET_TOP_PROFESSION_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const professionReviewCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_REVIEW_PROFESSION_REQUEST:
			return { loading: true };
		case CREATE_PROFESSION_SUCCESS:
			return { loading: false, success: true };
		case CREATE_REVIEW_PROFESSION_ERROR:
			return { loading: false, error: action.payload };
		case CREATE_REVIEW_PROFESSION_RESET:
			return {};
		default:
			return state;
	}
};

//Actions

export const listProfessionsAction =
	(keyword = '', pageNumber = '') =>
	async dispatch => {
		try {
			dispatch({ type: GET_ALL_PROFESSIONS_REQUEST });

			const { data } = await api.get(
				`/api/professions?keyword=${keyword}&pageNumber=${pageNumber}`
			);

			dispatch({
				type: GET_ALL_PROFESSIONS_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: GET_ALL_PROFESSIONS_ERROR,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const listProfessionsDetailsAction = id => async dispatch => {
	try {
		dispatch({
			type: GET_ALL_PROFESSIONS_SUCCESS,
		});

		const { data } = await api.get(`/api/professions/${id}`);

		dispatch({
			type: GET_PROFESSION_SUCCESS,
			payload: data,
			GET_PROFESSION_ERROR,
		});
	} catch (error) {
		dispatch({
			type: GET_ALL_PROFESSIONS_ERROR,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createProfessionAction = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: CREATE_PROFESSION_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await api.post(`/api/professions/create`, {}, config);

		dispatch({
			type: CREATE_PROFESSION_SUCCESS,
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
			type: CREATE_PROFESSION_ERROR,
			payload: message,
		});
	}
};

export const updateProfessionAction = doctor => async (dispatch, getState) => {
	try {
		dispatch({
			type: UPDATE_PROFESSION_REQUEST,
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

		const { data } = await api.put(`/api/professions/${doctor._id}`, doctor, config);

		dispatch({
			type: UPDATE_PROFESSION_SUCCESS,
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
			type: UPDATE_PROFESSION_ERROR,
			payload: message,
		});
	}
};

export const deleteProfessionAction = id => async (dispatch, getState) => {
	try {
		dispatch({
			type: DELETE_PROFESSION_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		await api.delete(`/api/professions/${id}`, config);

		dispatch({
			type: DELETE_PROFESSION_SUCCESS,
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
			type: DELETE_PROFESSION_ERROR,
			payload: message,
		});
	}
};

export const createProfessionReviewAction =
	(professionId, review) => async (dispatch, getState) => {
		try {
			dispatch({
				type: CREATE_PROFESSION_REQUEST,
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

			await api.post(`/api/professions/${professionId}/reviews`, review, config);

			dispatch({
				type: CREATE_PROFESSION_SUCCESS,
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
				type: CREATE_PROFESSION_ERROR,
				payload: message,
			});
		}
	};

export const listTopProfessionAction = () => async dispatch => {
	try {
		dispatch({
			type: GET_TOP_PROFESSION_REQUEST,
		});

		const { data } = await api.get('/api/professions/top');

		dispatch({
			type: GET_TOP_PROFESSION_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_TOP_PROFESSION_ERROR,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
