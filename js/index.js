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
        // makeMovieObj();
        let addedMovie = await addMovie(makeMovieObj());

        updatedMovies = await getUpdatedMovies()
        movies = updatedMovies
        console.log(makeMovieObj() + "here");
        await populateMovies(movies);
        console.log(updatedMovies, 'updated movies');
        console.log(movies, 'OG movies');

        $('#input-title').val('');
        $('#input-genres').val('');
        $('#input-actors').val('');

        addListeners();
        editMovie(movies);

    });

    console.log((movies));
    editMovie(movies);
    addListeners();

////////// FUNCTIONALITY FUNCTIONS //////////////

    function addListeners() { //I think the reason why it was not working was because there was an (arr) parameter in this function and it wasn't reading the length, I took it out and replaced arr with movies in all the loops and then I think that fixed it :D
        for (let i = 0; i < movies.length; i++) {
            $(`#deleteMovieBtn${i}`).on('click', async function (e) {
                e.preventDefault()

                console.log(i)
                let deleteCheck = confirm('Are you sure you wish to delete this movie?');

                if (deleteCheck) {
                    await deleteMovie(movies[i]);
                    console.log(deleteCheck);
                    updatedMovies = await getUpdatedMovies()
                    await populateMovies(updatedMovies).then(addListeners)
                }
            })
        }
        // editMovie(movies);

        for (let i = 0; i < movies.length; i++) {
            $(`#updateMovieBtn${i}`).on('click', function (e) {
                e.preventDefault();
                $(`#movie${i}`).toggleClass('hidden');
                $(`#update-form${i}`).toggleClass('hidden');
                // editMovie(movies);
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

        console.log(searchedMovie);
        // console.log(movies)
        console.log(changedMovie);

        html = '';
        await populateMovies(searchedMovie).then(addListeners);
        editMovie(searchedMovie);
    })

    /////// CHECKING FOR BUTTON CLICK ON UPDATE ////////

    ////// UPDATE MOVIE (PUT) //////////

    function editMovie(arr) {
        for (let i = 0; i < arr.length; i++) {
            $(`#updateMovie${i}`).on('click', async function (e) {
                e.preventDefault();
                let movieId = $(this).parents('[data-movie]').attr('data-movie');
                console.log(i)
                $(`#movie${i}`).toggleClass('hidden');
                $(`#update-form${i}`).toggleClass('hidden');
                let updateMovieObj =
                    {
                        id: movieId,
                        title: $(`#update-title${i}`).val(),
                        genre: $(`#update-genres${i}`).val(),
                        actors: $(`#update-actors${i}`).val()
                    }
                console.log(updateMovieObj)
                // console.log($(`#update-title${i}`).val())
                // console.log($(`#update-genres${i}`).val())
                // console.log($(`#update-actors${i}`).val())
                await updateMovie(updateMovieObj)
                console.log(arr);

                // if(arr.length === 1)
                // {
                // updatedMovies = await getUpdatedMovies()
                // await populateMovies(searchedMovie).then(addListeners);

                // }
                // else
                // {
                updatedMovies = await getUpdatedMovies()
                await populateMovies(updatedMovies).then(addListeners);
                // }
            });
        }
    }

    async function populateMovies(arr) {
        html = '';
        for (let i = 0; i < arr.length; i++) {
            html += `<div class="row border border-primery m-2" id="movies" data-movie="${arr[i].id}">
                        <div class="column" id="movie${i}">
                            <div class="d-flex align-items-end flex-column"><button id="deleteMovieBtn${i}" class="btn border border-primery">X</button></div>
                            <div id="title">Title: ${arr[i].title}</div>
                            <div id="movie-poster"></div>
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

    //console.log($.getJSON("https://api.themoviedb.org/3/discover/movie?api_key=${keys.TMDB_API}"));
    for (let i = 0; i < movies.length; i++)
    {
        // $('#title').focus(function () {
        //     let full = $("#movie-poster").has("img").length ? true : false;
        //     if (full === false) {
        //         $('#movie-poster').empty();
        //     }
        // });

        function getPoster(){
            let film = movies[i].title;

            if (film === '') {
                $('#movie-poster').html('<div class="alert"><strong>Oops!</strong> THERE IS NO TITLE TO SEARCH FOR </div>');
            } else {
                $('#movie-poster').html('<div class="alert"><strong>Loading...</strong></div>');

                $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${keys.TMDB_API}&query=${film}&callback=?`, function (json) {
                    if (json !== "Nothing found.") {
                        console.log(json);
                        $('#movie-poster').html(`<img src="https://image.tmdb.org/t/p/original/${json.results[0].poster_path}" class="img-responsive" \>`);
                    } else {
                        $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${keys.TMDB_API}&query=goonies&callback=?`, function (json) {
                            console.log(json);
                            $('#movie-poster').html('<div class="alert"><p>We\'re afraid nothing was found for that search.</p></div><img id="thePoster" src="http://image.tmdb.org/t/p/w500/' + json[0].poster_path + ' class="img-responsive" />');
                        });
                    }
                });
            }
            return false;
        }

        getPoster();
        // $('#term').keyup(function (event) {
        //     if (event.keyCode == 13) {
        //         getPoster();
        //     }
        // });


}




})();