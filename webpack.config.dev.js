const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizarPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		index: './src/index.js',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		clean: true,
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			'@components': path.resolve(__dirname, 'src/components/'),
			'@styles': path.resolve(__dirname, 'src/styles/'),
		},
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.html$/,
				use: [{ loader: 'html-loader' }],
			},
			{
				test: /\.s[ac]ss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: './index.html',
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
	],
	optimization: {
		minimize: true,
		minimizer: [new CssMinimizarPlugin(), new TerserPlugin()],
	},
};
