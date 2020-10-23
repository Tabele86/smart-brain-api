const { json } = require('body-parser');
const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
	apiKey: '41679de35aea4cfb82c9f8129778126d'
});

const handleAPI = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => res.status(400).json('unable to work with API'));
};

const handleImagePut = (req, res, db) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then((entries) => {
			res.json(entries[0]);
		})
		.catch((err) => res.status(400).json('unable to get entries'));
};

module.exports = {
	handleImagePut,
	handleAPI
};
