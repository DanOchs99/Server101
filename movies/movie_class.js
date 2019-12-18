class Movie {
    constructor (title, desc, genre) {
        this.title = title;
        this.desc = desc;
        this.genre = genre;
        this.posterURL = '';
        this.movieId = '';
    }
}

module.exports = Movie;