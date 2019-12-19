// import movie class
const Movie = require('../movie_class');

const uuidv4 = require('uuid/v4');

// test code - hardcode some movies so I have something to work with when server starts
// test code template
//movie = new Movie("", "", "");
//movie.movieId = new Date();
//movie.posterURL = '';
//movies.push(movie);

movie = new Movie("Contact","Dr. Ellie Arroway (Jodie Foster), after years of searching, finds conclusive radio proof of extraterrestrial intelligence, sending plans for a mysterious machine.","Sci-Fi");
movie.movieId = uuidv4();
movie.posterURL = 'https://m.media-amazon.com/images/M/MV5BYWNkYmFiZjUtYmI3Ni00NzIwLTkxZjktN2ZkMjdhMzlkMDc3XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg';
movies.push(movie);

movie = new Movie("Alien", "After a space merchant vessel perceives an unknown transmission as a distress call, its landing on the source moon finds one of the crew attacked by a mysterious lifeform, and they soon realize that its life cycle has merely begun.", "Sci-Fi");
movie.movieId = uuidv4();
movie.posterURL = 'https://m.media-amazon.com/images/M/MV5BMmQ2MmU3NzktZjAxOC00ZDZhLTk4YzEtMDMyMzcxY2IwMDAyXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg';
movies.push(movie);

movie = new Movie("Dirty Harry", "When a madman calling himself \"the Scorpio Killer\" menaces the city, tough as nails San Francisco Police Inspector \"Dirty\" Harry Callahan is assigned to track down and ferret out the crazed psychopath.", "Action");
movie.movieId = uuidv4();
movie.posterURL = 'https://m.media-amazon.com/images/M/MV5BMzdhMTM2YTItOWU2YS00MTM0LTgyNDYtMDM1OWM3NzkzNTM2XkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg';
movies.push(movie);

movie = new Movie("Skyscraper", "A security expert must infiltrate a burning skyscraper, 225 stories above ground, when his family is trapped inside by criminals.", "Action");
movie.movieId = uuidv4();
movie.posterURL = 'https://m.media-amazon.com/images/M/MV5BOGM3MzQwYzItNDA1Ny00MzIyLTg5Y2QtYTAwMzNmMDU2ZDgxXkEyXkFqcGdeQXVyMjMxOTE0ODA@._V1_SX300.jpg';
movies.push(movie);

// use express framework
const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    // main page - show the movies
    res.render('index', {movies: movies});
});

router.get('/:movieId',(req,res) => {
    // movie detail page
    movie = movies.filter( m => m.movieId == req.params.movieId );
    res.render('detail',movie[0]);
});

router.get('/genre/:genre',(req,res) => {
    // filter by genre
    let filtered_movies = movies.filter( m => m.genre == req.params.genre );
    res.render('index', {movies: filtered_movies})
});

router.get('/create/create',(req,res) => {
    // render the "add a movie" page
    res.render('addmovie')
});

router.post('/create',(req,res) => {
    // add a movie
    movie = new Movie(req.body.title, req.body.desc, req.body.genre);
    movie.movieId = uuidv4();
    // TODO - do something better about the poster image here
    movie.posterURL = req.body.posterURL;
    movies.push(movie);
    res.redirect('/');
});

router.post('/delete',(req,res) => {
   // delete a movie
   movies = movies.filter((movie) => {
       return (movie.movieId != req.body.delId);
   });
   res.redirect('/');
});

router.post('/upload/:movieId',(req,res) => {
    // upload a poster image and attach to movie

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let the_file = req.files.my_file;

    //console.log(the_file.name);
    //console.log(req.params.movieId);
    //console.log(__dirname + '/../public/images/' + the_file.name)

    the_file.mv(__dirname + '/../public/images/' + the_file.name , function(err) {
        // TODO - reimplement this callback to provide user feedback? for now log to server console...
        //res.writeHead(200, {"Content-Type": "text/plain"});
        if (err) {
            console.log(err);
            //res.write(err);
            //res.end();
        } 
        else {
            console.log(`uploaded ${the_file.name}`);
            //res.write("upload of file "+the_file.name+" complete");
            //res.end();
            for (let i=0; i<movies.length; i++) {
                if (movies[i].movieId == req.params.movieId) {
                    movies[i].posterURL = '/images/' + the_file.name;
                }
            }
        } 
    });
    res.redirect('/');
});

module.exports = router