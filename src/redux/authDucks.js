import axios from 'axios'

//TYPES

export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST'
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
export const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL'
export const USER_LOGOUT = 'USER_LOGOUT'

export const USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST'
export const USER_REGISTER_SUCCESS = 'USER_REGISTER_SUCCESS'
export const USER_REGISTER_FAIL = 'USER_REGISTER_FAIL'

export const USER_DETAILS_REQUEST = 'USER_DETAILS_REQUEST'
export const USER_DETAILS_SUCCESS = 'USER_DETAILS_SUCCESS'
export const USER_DETAILS_FAIL = 'USER_DETAILS_FAIL'
export const USER_DETAILS_RESET = 'USER_DETAILS_RESET'

export const USER_UPDATE_PROFILE_REQUEST = 'USER_UPDATE_PROFILE_REQUEST'
export const USER_UPDATE_PROFILE_SUCCESS = 'USER_UPDATE_PROFILE_SUCCESS'
export const USER_UPDATE_PROFILE_FAIL = 'USER_UPDATE_PROFILE_FAIL'
export const USER_UPDATE_PROFILE_RESET = 'USER_UPDATE_RESET'

export const USER_DELETE_REQUEST = 'USER_DELETE_REQUEST'
export const USER_DELETE_SUCCESS = 'USER_DELETE_SUCCESS'
export const USER_DELETE_FAIL = 'USER_DELETE_FAIL'

export const USER_UPDATE_REQUEST = 'USER_UPDATE_REQUEST'
export const USER_UPDATE_SUCCESS = 'USER_UPDATE_SUCCESS'
export const USER_UPDATE_FAIL = 'USER_UPDATE_FAIL'
export const USER_UPDATE_RESET = 'USER_UPDATE_RESET'

//REDUCERS

export const userLoginReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_LOGIN_REQUEST:
			return { loading: true }
		case USER_LOGIN_SUCCESS:
			return { loading: false, userInfo: action.payload }
		case USER_LOGIN_FAIL:
			return { loading: false, error: action.payload }
		case USER_LOGOUT:
			return {}
		default:
			return state
	}
}

export const userRegisterReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_REGISTER_REQUEST:
			return { loading: true }
		case USER_REGISTER_SUCCESS:
			return { loading: false, userInfo: action.payload }
		case USER_REGISTER_FAIL:
			return { loading: false, error: action.payload }
		case USER_LOGOUT:
			return {}
		default:
			return state
	}
}

export const userDetailsReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case USER_DETAILS_REQUEST:
			return { ...state, loading: true }
		case USER_DETAILS_SUCCESS:
			return { loading: false, user: action.payload }
		case USER_DETAILS_FAIL:
			return { loading: false, error: action.payload }
		case USER_DETAILS_RESET:
			return { user: {} }
		default:
			return state
	}
}

export const userUpdateProfileReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_UPDATE_PROFILE_REQUEST:
			return { loading: true }
		case USER_UPDATE_PROFILE_SUCCESS:
			return { loading: false, success: true, userInfo: action.payload }
		case USER_UPDATE_PROFILE_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const userDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_DELETE_REQUEST:
			return { loading: true }
		case USER_DELETE_SUCCESS:
			return { loading: false, success: true }
		case USER_DELETE_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const userUpdateReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case USER_UPDATE_REQUEST:
			return { loading: true }
		case USER_UPDATE_SUCCESS:
			return { loading: false, success: true }
		case USER_UPDATE_FAIL:
			return { loading: false, error: action.payload }
		case USER_UPDATE_RESET:
			return {
				user: {},
			}
		default:
			return state
	}
}

//ACTIONS

export const loginAction = (email, password) => async dispatch => {
	try {
		dispatch({
			type: USER_LOGIN_REQUEST,
		})

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const { data } = await axios.post('/api/users/login', { email, password }, config)

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		})

		localStorage.setItem('userInfo', JSON.stringify(data))
	} catch (error) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const logoutAction = () => dispatch => {
	localStorage.removeItem('userInfo')
	localStorage.removeItem('cartItems')
	localStorage.removeItem('shippingAddress')
	localStorage.removeItem('paymentMethod')
	dispatch({ type: USER_LOGOUT })
	dispatch({ type: USER_DETAILS_RESET })
	document.location.href = '/login'
}

export const registerAction = (name, email, password) => async dispatch => {
	try {
		dispatch({
			type: USER_REGISTER_REQUEST,
		})

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const { data } = await axios.post('/api/users', { name, email, password }, config)

		dispatch({
			type: USER_REGISTER_SUCCESS,
			payload: data,
		})

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		})

		localStorage.setItem('userInfo', JSON.stringify(data))
	} catch (error) {
		dispatch({
			type: USER_REGISTER_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const getUserDetailsAction = id => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DETAILS_REQUEST,
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		const { data } = await axios.get(`/api/users/${id}`, config)

		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		})
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
		if (message === 'You cannot PASS!!') {
			dispatch(logoutAction())
		}
		dispatch({
			type: USER_DETAILS_FAIL,
			payload: message,
		})
	}
}

export const updateUserProfileAction = user => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_PROFILE_REQUEST,
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		const { data } = await axios.put(`/api/users/profile`, user, config)

		dispatch({
			type: USER_UPDATE_PROFILE_SUCCESS,
			payload: data,
		})
		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		})
		localStorage.setItem('userInfo', JSON.stringify(data))
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
		if (message === 'You cannot PASS!!') {
			dispatch(logoutAction())
		}
		dispatch({
			type: USER_UPDATE_PROFILE_FAIL,
			payload: message,
		})
	}
}

export const deleteUserAction = id => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DELETE_REQUEST,
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		await axios.delete(`/api/users/${id}`, config)

		dispatch({ type: USER_DELETE_SUCCESS })
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
		if (message === 'You cannot PASS!!') {
			dispatch(logoutAction())
		}
		dispatch({
			type: USER_DELETE_FAIL,
			payload: message,
		})
	}
}

export const updateUserAction = user => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_REQUEST,
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		const { data } = await axios.put(`/api/users/${user._id}`, user, config)

		dispatch({ type: USER_UPDATE_SUCCESS })

		dispatch({ type: USER_DETAILS_SUCCESS, payload: data })

		dispatch({ type: USER_DETAILS_RESET })
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
		if (message === 'You cannot PASS!!') {
			dispatch(logoutAction())
		}
		dispatch({
			type: USER_UPDATE_FAIL,
			payload: message,
		})
	}
}
