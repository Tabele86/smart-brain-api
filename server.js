const express = require('express');
const bodyParser = require('body-parser');
const local_env = require('dotenv').config({ path: __dirname + '/.env.local' });
const bcrypt = require('bcrypt-nodejs');
// this is used to enable CORS
const cors = require('cors');
// Knex for connecting the server and the database
const knex = require('knex');

// CONTROLLERS
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//old heroku ssl:true error fix
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
// makes TLS connections and HTTPS requests insecure by disabling certificate verification.

// Here's the connection to the database using Knex
const db = knex({
	client: 'pg', // pg for postgres
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true
		//{rejectUnauthorized: false} ssl true error fix 2
	}
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ROOT ROUTE
app.get('/', (req, res) => {
	res.send('it is working');
});
// SIGNIN ROUTE (more comments in controllers)
// In here we're doing a dependency injection ie. injecting the dependencies
// that the handleRegister function needs like the knex database and bcrypt.
app.post('/signin', signin.handleSignin(db, bcrypt));
// a bit more advanced way is used here - the other routes could be changed to similar syntax depending on preference

// REGISTER ROUTE
app.post('/register', (req, res) => {
	register.handleRegister(req, res, db, bcrypt);
});
// PROFILE ROUTE
// Can have any number as id.
// This will GET the user for their homepage.
app.get('/profile/:id', (req, res) => {
	profile.handleProfileGet(req, res, db);
});
// IMAGE ROUTE
app.put('/image', (req, res) => {
	handeImagePut(req, res, db);
});
app.post('/imageurl', (req, res) => {
	handeAPI(req, res);
});
app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
});
