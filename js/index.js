(async () => {
    // This is the entry point for your application. Write all of your code here.
    // Before you can use the database, you need to configure the "db" object
    // with your team name in the "js/movies-api.js" file.

    let movies = await getMovies();
    let html = '';
    console.log(movies);

    populateMovies();

    const makeMovieObj = () => {
        return {
            title: $('#input-title').val(),
            genre: $('#input-genres').val(),
            actors: $('#input-actors').val()
        }
    }

    $('#submitMovie').on('click', async function (e) {

        html = '';

        e.preventDefault();
        // makeMovieObj();

        let addedMovies = await addMovie(makeMovieObj());
        console.log(makeMovieObj());
        let allMovies = await populateMovies();
    });

    async function populateMovies() {
        for (let movie of movies) {

            html += `<div class="row" id="movie">
                    <div class="column">
                        <div id="title">${movie.title}</div>
                        <div id="movie-poster"></div>
                        <div id="genres">${movie.genre}</div>
                        <div id="actors">${movie.actors}</div>
                    </div>
                    
                 </div>`
        }
        $('#movies').html(html);
    }


})();