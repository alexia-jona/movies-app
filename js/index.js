(async () => {
    // This is the entry point for your application. Write all of your code here.
    // Before you can use the database, you need to configure the "db" object
    // with your team name in the "js/movies-api.js" file.

    let movies = await getMovies();
    let html = '';

    await populateMovies(movies);

    const makeMovieObj = () => {
        return {
            title: $('#input-title').val(),
            genre: $('#input-genres').val(),
            actors: $('#input-actors').val()
        }
    }

    let updatedMovies;
    $('#submitMovie').on('click', async function (e) {
        e.preventDefault();
        let addedMovie = await addMovie(makeMovieObj());

        updatedMovies = await getUpdatedMovies()
        movies = updatedMovies
        await populateMovies(movies);

        $('#input-title').val('');
        $('#input-genres').val('');
        $('#input-actors').val('');

        addListeners();
        posterOnLoad(movies);
        editMovie(movies);

    });

    editMovie(movies);
    addListeners();

////////// FUNCTIONALITY FUNCTIONS //////////////

    function addListeners() {
        for (let i = 0; i < movies.length; i++) {
            $(`#deleteMovieBtn${i}`).on('click', async function (e) {
                e.preventDefault()

                let deleteCheck = confirm('Are you sure you wish to delete this movie?');

                if (deleteCheck) {
                    await deleteMovie(movies[i]);
                    updatedMovies = await getUpdatedMovies()
                    await populateMovies(updatedMovies).then(addListeners)
                }
                renderPosters(updatedMovies)
            })
        }

        for (let i = 0; i < movies.length; i++) {
            $(`#updateMovieBtn${i}`).on('click', function (e) {
                e.preventDefault();
                $(`#movie${i}`).toggleClass('hidden');
                $(`#update-form${i}`).toggleClass('hidden');
            });
        }
    }


    /////// SEARCH BAR ////////////////

    let searchedMovie;
    let changedMovie;
    $('#searchBtn').on('click', async function (e) {
        e.preventDefault();
        searchedMovie = movies.filter(movie => movie.title.toLowerCase() === $('#movie-search').val().toLowerCase());
        changedMovie = await getMovie(searchedMovie);

        html = '';
        await populateMovies(searchedMovie).then(addListeners);
        editMovie(searchedMovie);
        renderPosters(searchedMovie)
    })

    /////// CHECKING FOR BUTTON CLICK ON UPDATE ////////

    function editMovie(arr) {
        for (let i = 0; i < arr.length; i++) {
            $(`#updateMovie${i}`).on('click', async function (e) {
                e.preventDefault();
                let movieId = $(this).parents('[data-movie]').attr('data-movie');
                $(`#movie${i}`).toggleClass('hidden');
                $(`#update-form${i}`).toggleClass('hidden');
                let updateMovieObj =
                    {
                        id: movieId,
                        title: $(`#update-title${i}`).val(),
                        genre: $(`#update-genres${i}`).val(),
                        actors: $(`#update-actors${i}`).val()
                    }
                await updateMovie(updateMovieObj)
                updatedMovies = await getUpdatedMovies()
                await populateMovies(updatedMovies).then(addListeners);
                renderPosters(updatedMovies);
            });
        }
    }

    async function populateMovies(arr) {
        html = '';
        for (let i = 0; i < arr.length; i++) {
            html += `<div class="row border border-primary m-2" id="movies" data-movie="${arr[i].id}">
                        <div class="column " id="movie${i}">
                            <div class="d-flex align-items-end flex-column"><button id="deleteMovieBtn${i}" class="btn border border-primery">X</button></div>
                            <div id="title${i}">Title: ${arr[i].title}</div>
                            <div id="movie-poster${i}" class="movie-poster"></div>
                            <div id="genres">Genre(s): ${arr[i].genre}</div>
                            <div id="actors">Actor(s): ${arr[i].actors}</div>
                            <div class="d-flex align-items-end"><button id="updateMovieBtn${i}" class="">Update</button></div>
                        </div>
                        <div class="column hidden" id="update-form${i}">
                            <form>
                                <input type="text" id="update-title${i}" name="title" placeholder="Change Title..." value="${arr[i].title}"><br>
                                <input type="text" id="update-genres${i}" name="genres" placeholder="Change genres..." value="${arr[i].genre}"><br>
                                <input type="text" id="update-actors${i}" name="actors" placeholder="Change actors..." value="${arr[i].actors}"><br><br>
                                <input type="submit" value="Update Movie" id="updateMovie${i}">
                            </form>
                        </div> <!---- FORM COLUMN ------>
                 </div>`
        }
        $('#movies').html(html);
    }

///// MOVIE POSTER GENERATOR FROM https://codepen.io/pixelnik/pen/pgWQBZ ////////
    function posterOnLoad(arg) {
        for (let i = 0; i < arg.length; i++) {
            $(`#title${i}`).focus(function () {
                let full = $(`#movie-poster${i}`).has("img").length ? true : false;
                if (full === false) {
                    $(`#movie-poster${i}`).empty();
                }
            });
            let film = movies[i].title;
            $(`#movie-poster${i}`).html('<div class="alert"><strong>Loading...</strong></div>');
            $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${keys.TMDB_API}&query=${film}&callback=?`, function (json) {
                if (json !== "Nothing found.") {
                    $(`#movie-poster${i}`).html(`<img src="https://image.tmdb.org/t/p/original/${json.results[0].poster_path}" class="movie-poster"\>`);
                } else {
                    $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${keys.TMDB_API}&query=goonies&callback=?`, function (json) {
                        $(`#movie-poster${i}`).html('<div class="alert"><p>We\'re afraid nothing was found for that search.</p></div><img id="thePoster" src="http://image.tmdb.org/t/p/w500/" ' + json[0].poster_path + ' class="movie-poster" />');
                    });
                }
            });
        }
    }

    posterOnLoad(movies)

    function renderPosters(updatedMovies) {
        for (let i = 0; i < updatedMovies.length; i++) {
            $(`#title${i}`).focus(function () {
                let full = $(`#movie-poster${i}`).has("img").length ? true : false;
                if (full === false) {
                    $(`#movie-poster${i}`).empty();
                }
            });
            let film = updatedMovies[i].title;
            console.log(film);
            if (film === '') {
                $(`#movie-poster${i}`).html('<div class="alert"><strong>Oops!</strong> THERE IS NO TITLE TO SEARCH FOR </div>');
            } else {
                $(`#movie-poster${i}`).html('<div class="alert"><strong>Loading...</strong></div>');

                $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${keys.TMDB_API}&query=${film}&callback=?`, function (json) {
                    if (json !== "Nothing found.") {
                        $(`#movie-poster${i}`).html(`<img src="https://image.tmdb.org/t/p/original/${json.results[0].poster_path}" class="movie-poster"\>`);
                    } else {
                        $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${keys.TMDB_API}&query=goonies&callback=?`, function (json) {
                            $(`#movie-poster${i}`).html('<div class="alert"><p>We\'re afraid nothing was found for that search.</p></div><img id="thePoster" src="http://image.tmdb.org/t/p/w500/" ' + json[0].poster_path + ' class="movie-poster" />');
                        });
                    }
                });
            }
        }
    }

})();