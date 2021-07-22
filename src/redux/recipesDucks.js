import backend from '../services/apiServices';
import { logoutAction } from './authDucks';

//Types

export const GET_ALL_RECIPES_REQUEST = 'GET_ALL_RECIPES_REQUEST';
export const GET_ALL_RECIPES_SUCCESS = 'GET_ALL_RECIPES_SUCCESS';
export const GET_ALL_RECIPES_ERROR = 'GET_ALL_RECIPES_ERROR';

export const GET_RECIPE_REQUEST = 'GET_RECIPE_REQUEST';
export const GET_RECIPE_SUCCESS = 'GET_RECIPE_SUCCESS';
export const GET_RECIPE_ERROR = 'GET_RECIPE_ERROR';

export const CREATE_RECIPE_REQUEST = 'CREATE_RECIPE_REQUEST';
export const CREATE_RECIPE_SUCCESS = 'CREATE_RECIPE_SUCCESS';
export const CREATE_RECIPE_ERROR = 'CREATE_RECIPE_ERROR';
export const CREATE_RECIPE_RESET = 'CREATE_RECIPE_RESET';

export const UPDATE_RECIPE_REQUEST = 'UPDATE_RECIPE_REQUEST';
export const UPDATE_RECIPE_SUCCESS = 'UPDATE_RECIPE_SUCCESS';
export const UPDATE_RECIPE_ERROR = 'UPDATE_RECIPE_ERROR';
export const UPDATE_RECIPE_RESET = 'UPDATE_RECIPE_RESET';

export const DELETE_RECIPE_REQUEST = 'DELETE_RECIPE_REQUEST';
export const DELETE_RECIPE_SUCCESS = 'DELETE_RECIPE_SUCCESS';
export const DELETE_RECIPE_ERROR = 'DELETE_RECIPE_ERROR';

export const GET_TOP_RECIPES_REQUEST = 'GET_TOP_RECIPES_REQUEST';
export const GET_TOP_RECIPES_SUCCESS = 'GET_TOP_RECIPES_SUCCESS';
export const GET_TOP_RECIPES_ERROR = 'GET_TOP_RECIPES_ERROR';

export const CREATE_RECIPE_REVIEW_REQUEST = 'CREATE_RECIPE_REVIEW_REQUEST';
export const CREATE_RECIPE_REVIEW_SUCCESS = 'CREATE_RECIPE_REVIEW_SUCCESS';
export const CREATE_RECIPE_REVIEW_ERROR = 'CREATE_RECIPE_REVIEW_ERROR';
export const CREATE_RECIPE_REVIEW_RESET = 'CREATE_RECIPE_REVIEW_RESET';

//Reducer

export const recipesListReducer = (state = { recipes: [] }, action) => {
	switch (action.type) {
		case GET_ALL_RECIPES_REQUEST:
			return { loading: true, recipes: [] };
		case GET_ALL_RECIPES_SUCCESS:
			return {
				loading: false,
				recipes: action.payload.recipes,
				pages: action.payload.pages,
				page: action.payload.page,
			};
		case GET_ALL_RECIPES_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const recipesDetailsReducer = (state = { recipe: { reviews: [] } }, action) => {
	switch (action.type) {
		case GET_RECIPE_REQUEST:
			return { ...state, loading: true };
		case GET_RECIPE_SUCCESS:
			return { loading: false, recipe: action.payload };
		case GET_RECIPE_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const recipeCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_RECIPE_REQUEST:
			return { loading: true };
		case CREATE_RECIPE_SUCCESS:
			return { loading: false, success: true, recipe: action.payload };
		case CREATE_RECIPE_ERROR:
			return { loading: false, error: action.payload };
		case CREATE_RECIPE_RESET:
			return {};
		default:
			return state;
	}
};

export const recipeUpdateReducer = (state = { recipe: {} }, action) => {
	switch (action.type) {
		case UPDATE_RECIPE_REQUEST:
			return { loading: true };
		case UPDATE_RECIPE_SUCCESS:
			return { loading: true, success: true, recipe: action.payload };
		case UPDATE_RECIPE_ERROR:
			return { loading: false, error: action.payload };
		case UPDATE_RECIPE_RESET:
			return {};
		default:
			return state;
	}
};

export const recipeDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case DELETE_RECIPE_REQUEST:
			return { loading: true };
		case DELETE_RECIPE_SUCCESS:
			return { loading: false, success: true };
		case DELETE_RECIPE_ERROR:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const recipeTopReviewReducer = (state = { recipes: [] }, action) => {
	switch (action.type) {
		case GET_TOP_RECIPES_REQUEST:
			return { loading: true, recipes: [] };
		case GET_TOP_RECIPES_SUCCESS:
			return { loading: false, recipes: action.payload };
		case GET_TOP_RECIPES_ERROR:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const recipeReviewCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CREATE_RECIPE_REVIEW_REQUEST:
			return { loading: true };
		case CREATE_RECIPE_REVIEW_SUCCESS:
			return { loading: false, success: true };
		case CREATE_RECIPE_REVIEW_ERROR:
			return { loading: false, error: action.payload };
		case CREATE_RECIPE_REVIEW_RESET:
			return {};
		default:
			return state;
	}
};
//Actions

export const listRecipesAction =
	(keyword = '', pageNumber = '') =>
	async dispatch => {
		try {
			dispatch({ type: GET_ALL_RECIPES_REQUEST });

			const { data } = await backend.get(
				`/api/recipes?keyword=${keyword}&pageNumber=${pageNumber}`
			);

			dispatch({
				type: GET_ALL_RECIPES_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: GET_ALL_RECIPES_ERROR,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const listRecipesDetailsAction = id => async dispatch => {
	try {
		dispatch({
			type: GET_ALL_RECIPES_SUCCESS,
		});

		const { data } = await backend.get(`/api/recipes/${id}`);

		dispatch({
			type: GET_RECIPE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_ALL_RECIPES_ERROR,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createRecipeAction = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: CREATE_RECIPE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await backend.post(`/api/recipes`, {}, config);

		dispatch({
			type: CREATE_RECIPE_SUCCESS,
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
			type: CREATE_RECIPE_ERROR,
			payload: message,
		});
	}
};

export const updateRecipeAction = recipe => async (dispatch, getState) => {
	try {
		dispatch({
			type: UPDATE_RECIPE_REQUEST,
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

		const { data } = await backend.put(`/api/recipes/${recipe._id}`, recipe, config);

		dispatch({
			type: UPDATE_RECIPE_SUCCESS,
			payload: data,
		});

		dispatch({
			type: GET_RECIPE_SUCCESS,
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
			type: UPDATE_RECIPE_ERROR,
			payload: message,
		});
	}
};

export const deleteRecipeAction = id => async (dispatch, getState) => {
	try {
		dispatch({
			type: DELETE_RECIPE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		await backend.delete(`/api/recipes/${id}`, config);

		dispatch({
			type: DELETE_RECIPE_SUCCESS,
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
			type: DELETE_RECIPE_ERROR,
			payload: message,
		});
	}
};

export const createRecipeReviewAction =
	(recipeId, review) => async (dispatch, getState) => {
		try {
			dispatch({
				type: CREATE_RECIPE_REQUEST,
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

			await backend.post(`/api/recipes/${recipeId}/reviews`, review, config);

			dispatch({
				type: CREATE_RECIPE_SUCCESS,
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
				type: CREATE_RECIPE_ERROR,
				payload: message,
			});
		}
	};

export const listTopRecipesAction = () => async dispatch => {
	try {
		dispatch({
			type: GET_TOP_RECIPES_REQUEST,
		});

		const { data } = await backend.get('/api/recipes/top');

		dispatch({
			type: GET_TOP_RECIPES_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: GET_TOP_RECIPES_ERROR,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
