import backend from '../services/apiServices';

import { logoutAction } from './authDucks';

//Types

export const GET_ALL_DOCTORS_REQUEST = 'GET_ALL_DOCTORS_REQUEST';
export const GET_ALL_DOCTORS_SUCCESS = 'GET_ALL_DOCTORS_SUCCESS';
export const GET_ALL_DOCTORS_ERROR = 'GET_ALL_DOCTORS_ERROR';

export const GET_DOCTOR_REQUEST = 'GET_DOCTOR_REQUEST';
export const GET_DOCTOR_SUCCESS = 'GET_DOCTOR_SUCCESS';
export const GET_DOCTOR_ERROR = 'GET_DOCTOR_ERROR';

export const CREATE_DOCTOR_REQUEST = 'CREATE_DOCTOR_REQUEST';
export const CREATE_DOCTOR_SUCCESS = 'CREATE_DOCTOR_SUCCESS';
export const CREATE_DOCTOR_ERROR = 'CREATE_DOCTOR_ERROR';
export const CREATE_DOCTOR_RESET = 'CREATE_DOCTOR_RESET';

export const UPDATE_DOCTOR_REQUEST = 'UPDATE_DOCTOR_REQUEST';
export const UPDATE_DOCTOR_SUCCESS = 'UPDATE_DOCTOR_SUCCESS';
export const UPDATE_DOCTOR_ERROR = 'UPDATE_DOCTOR_ERROR';
export const UPDATE_DOCTOR_RESET = 'UPDATE_DOCTOR_RESET';

export const DELETE_DOCTOR_REQUEST = 'DELETE_DOCTOR_REQUEST';
export const DELETE_DOCTOR_SUCCESS = 'DELETE_DOCTOR_SUCCESS';
export const DELETE_DOCTOR_ERROR = 'DELETE_DOCTOR_ERROR';

export const GET_TOP_DOCTOR_REQUEST = 'GET_TOP_DOCTOR_REQUEST';
export const GET_TOP_DOCTOR_SUCCESS = 'GET_TOP_DOCTOR_SUCCESS';
export const GET_TOP_DOCTOR_ERROR = 'GET_TOP_DOCTOR_ERROR';

export const CREATE_REVIEW_DOCTOR_REQUEST = 'CREATE_REVIEW_DOCTOR_REQUEST';
export const CREATE_REVIEW_DOCTOR_SUCCESS = 'CREATE_REVIEW_DOCTOR_SUCCESS';
export const CREATE_REVIEW_DOCTOR_ERROR = 'CREATEREVIEWDOCTOR_ERROR';
export const CREATE_REVIEW_DOCTOR_RESET = 'CREATEREVIEWDOCTOR_RESET';

//Reducer

export const doctorListReducer = (state = { doctors: [] }, action) => {
	switch (action.type) {
		case GET_ALL_DOCTORS_REQUEST:
			return { ...state, loading: true, doctors: [] };
		case GET_ALL_DOCTORS_SUCCESS:
			return {
				loading: false,
				doctors: action.payload.doctors,
				pages: action.payload.pages,
				page: action.payload.page,
			};
		case GET_ALL_DOCTORS_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const doctorsDetailsReducer = (state = { doctor: { reviews: [] } }, action) => {
	switch (action.type) {
		case GET_DOCTOR_REQUEST:
			return { ...state, loading: true };
		case GET_DOCTOR_SUCCESS:
			return { loading: false, doctor: action.payload };
		case GET_DOCTOR_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const doctorCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_DOCTOR_REQUEST:
			return { loading: true };
		case CREATE_DOCTOR_SUCCESS:
			return { loading: false, success: true, doctor: action.payload };
		case CREATE_DOCTOR_ERROR:
			return { loading: false, error: action.payload };
		case CREATE_DOCTOR_RESET:
			return {};
		default:
			return state;
	}
};

export const doctorUpdateReducer = (state = { doctor: {} }, action) => {
	switch (action.type) {
		case UPDATE_DOCTOR_REQUEST:
			return { loading: true };
		case UPDATE_DOCTOR_SUCCESS:
			return { loading: false, success: true, doctor: action.payload };
		case UPDATE_DOCTOR_ERROR:
			return { loading: false, error: action.payload };
		case UPDATE_DOCTOR_RESET:
			return {};
		default:
			return state;
	}
};

export const doctorDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_DOCTOR_REQUEST:
			return { loading: true };
		case DELETE_DOCTOR_SUCCESS:
			return { loading: false, doctors: action.payload };
		case DELETE_DOCTOR_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const doctorTopReviewReducer = (state = { doctors: [] }, action) => {
	switch (action.type) {
		case GET_TOP_DOCTOR_REQUEST:
			return { loading: true };
		case GET_TOP_DOCTOR_SUCCESS:
			return { loading: false, doctors: [] };
		case GET_TOP_DOCTOR_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const doctorReviewCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_REVIEW_DOCTOR_REQUEST:
			return { loading: true };
		case CREATE_REVIEW_DOCTOR_SUCCESS:
			return { loading: false, success: true };
		case CREATE_REVIEW_DOCTOR_ERROR:
			return { loading: false, error: action.payload };
		case CREATE_REVIEW_DOCTOR_RESET:
			return {};
		default:
			return state;
	}
};

//Actions

export const listDoctorsAction =
	(keyword = '', pageNumber = '') =>
	async dispatch => {
		try {
			dispatch({ type: GET_ALL_DOCTORS_REQUEST });

			const { data } = await backend.get(
				`/api/doctors?keyword=${keyword}&pageNumber=${pageNumber}`
			);

			dispatch({
				type: GET_ALL_DOCTORS_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: GET_ALL_DOCTORS_ERROR,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const listDoctorsDetailsAction = id => async dispatch => {
	try {
		dispatch({
			type: GET_ALL_DOCTORS_SUCCESS,
		});

		const { data } = await backend.get(`/api/doctors/${id}`);

		dispatch({
			type: GET_DOCTOR_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_ALL_DOCTORS_ERROR,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createDoctorAction = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: CREATE_DOCTOR_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await backend.post(`/api/doctors/create`, {}, config);

		dispatch({
			type: CREATE_DOCTOR_SUCCESS,
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
			type: CREATE_DOCTOR_ERROR,
			payload: message,
		});
	}
};

export const updateDoctorAction = doctor => async (dispatch, getState) => {
	try {
		dispatch({
			type: UPDATE_DOCTOR_REQUEST,
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

		const { data } = await backend.put(`/api/doctors/${doctor._id}`, doctor, config);

		dispatch({
			type: UPDATE_DOCTOR_SUCCESS,
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
			type: UPDATE_DOCTOR_ERROR,
			payload: message,
		});
	}
};

export const deleteDoctorAction = id => async (dispatch, getState) => {
	try {
		dispatch({
			type: DELETE_DOCTOR_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		await backend.delete(`/api/doctors/${id}`, config);

		dispatch({
			type: DELETE_DOCTOR_SUCCESS,
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
			type: DELETE_DOCTOR_ERROR,
			payload: message,
		});
	}
};

export const createDoctorReviewAction =
	(doctorId, review) => async (dispatch, getState) => {
		try {
			dispatch({
				type: CREATE_DOCTOR_REQUEST,
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

			await backend.post(`/api/doctors/${doctorId}/reviews`, review, config);

			dispatch({
				type: CREATE_DOCTOR_SUCCESS,
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
				type: CREATE_DOCTOR_ERROR,
				payload: message,
			});
		}
	};

export const listTopDoctorAction = () => async dispatch => {
	try {
		dispatch({
			type: GET_TOP_DOCTOR_REQUEST,
		});

		const { data } = await backend.get('/api/doctors/top');

		dispatch({
			type: GET_TOP_DOCTOR_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_TOP_DOCTOR_ERROR,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
