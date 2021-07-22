import axios from 'axios';

export default axios.create({
	baseURL: 'https://vegan-city-api.herokuapp.com',
});
