// IMAGE ROUTE
// This is for increasing the user entries number when they use the application.
// Gets the id from the body and again uses Knex syntax for incrementing entries.
const Clarifai = require('clarifai');

// API KEY
//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
	apiKey: '41679de35aea4cfb82c9f8129778126d'
	// apiKey: process.env.API_KEY //add your own .env file
});

// Clarifai's face detection magic
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
		.where('id', '=', id) // notice it's not === since this is sql
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
