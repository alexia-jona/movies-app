(async () => {
    // This is the entry point for your application. Write all of your code here.
    // Before you can use the database, you need to configure the "db" object
    // with your team name in the "js/movies-api.js" file.

    let movies = await getMovies();
    let html = '';

    populateMovies(movies);

    const makeMovieObj = () => {
        return {
            title: $('#input-title').val(),
            genre: $('#input-genres').val(),
            actors: $('#input-actors').val()
        }
    }

    async function fetchMovies() {
        const response = fetch('/movies');
        console.log(response)
    }
let updatedMovies;
    $('#submitMovie').on('click', async function (e) {
        e.preventDefault();
        // makeMovieObj();
        let addedMovie = await addMovie(makeMovieObj());

        updatedMovies = await getUpdatedMovies()
        movies = updatedMovies
        console.log(makeMovieObj());
        await populateMovies(movies);
        console.log(updatedMovies);

    });



    for (let i = 0; i < movies.length; i++) {
        $(`#deleteMovieBtn${i}`).on('click', async function (e) {
            e.preventDefault()
                deleteMovie(movies[i])
            console.log(i)
        })
    }

    async function populateMovies(arr) {
        html = '';
        for (let i = 0; i < arr.length; i++) {

            html += `<div class="row" id="movie">
                    <div class="column">
                    <button id="deleteMovieBtn${i}" onclick="">X</button>
                        <div id="title">${arr[i].title}</div>
                        <div id="movie-poster"></div>
                        <div id="genres">${arr[i].genre}</div>
                        <div id="actors">${arr[i].actors}</div>
                    </div>
                    
                 </div>`
        }
        $('#movies').html(html);
    }


})();