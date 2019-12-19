// create a global array to hold data, this is an array of Movie objects
global.movies = [];

// use express framework
const express = require('express');
const app = express();

app.use(express.static('public'));

// parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));

// middleware to handle uploading files
const fileUpload = require('express-fileupload');
app.use(fileUpload({ safeFileNames: true, preserveExtension: true }));

// get a path to the templates directory
const path = require('path');
const VIEWS_PATH = path.join(__dirname, '/views');

// use mustache template engine w/ partials
const mustacheExpress = require('mustache-express');

app.engine('mustache',mustacheExpress(VIEWS_PATH+'/partials','.mustache'));
app.set('views',VIEWS_PATH);
app.set('view engine','mustache');

// use express router in movies.js to handle /movies routes
const moviesRouter = require('./routes/movies');
app.use('/movies',moviesRouter);

// handle the root route - redirect to /movies
app.get('/',(req,res) => {
    res.redirect('/movies');
});

// Web API - send all movies as JSON
app.get('/api/movies',(req,res) => {
    // send all movies as JSON
    res.json({movies: movies});
});

app.listen(3000, () => {
    console.log("Server is running on PORT 3000...")
});
