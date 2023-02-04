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

        addListeners(movies);
        editMovie(movies);

    });

    console.log((movies));
    editMovie(movies);

////////// FUNCTIONALITY FUNCTIONS //////////////

    function addListeners(arr) {
        for (let i = 0; i < arr.length; i++) {
            $(`#deleteMovieBtn${i}`).on('click', async function (e) {
                e.preventDefault()

                console.log(i)
                let deleteCheck = confirm('Are you sure you wish to delete this movie?');

                if (deleteCheck) {
                    await deleteMovie(arr[i]);
                    console.log(deleteCheck);
                    updatedMovies = await getUpdatedMovies()
                    await populateMovies(updatedMovies)

                    // location.reload()
                }
            })
        }
        editMovie(arr);

        for (let i = 0; i < movies.length; i++) {
            $(`#updateMovieBtn${i}`).on('click', function (e) {
                e.preventDefault();
                $(`#movie${i}`).toggleClass('hidden');
                $(`#update-form${i}`).toggleClass('hidden');
                // editMovie(movies);
            });
        }
    }

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
                console.log(arr)
                updatedMovies = await getUpdatedMovies()
                populateMovies(updatedMovies).then(addListeners)

                // location.reload();

                // removeMovie(arr);
            });
        }
    }

    async function populateMovies(arr) {
        html = '';
        for (let i = 0; i < arr.length; i++) {
            html += `<div class="row" id="movies" data-movie="${arr[i].id}">
                        <div class="column" id="movie${i}">
                            <button id="deleteMovieBtn${i}">X</button>
                            <div id="title">Title: ${arr[i].title}</div>
                            <div id="movie-poster"></div>
                            <div id="genres">Genre(s): ${arr[i].genre}</div>
                            <div id="actors">Actor(s): ${arr[i].actors}</div>
                            <button id="updateMovieBtn${i}" onclick="">Update</button>
                        </div>
                        <div class="column hidden" id="update-form${i}">
                            <form>
                                <input type="text" id="update-title${i}" name="title" placeholder="Change Title..."><br>
                                <input type="text" id="update-genres${i}" name="genres" placeholder="Change genres..."><br>
                                <input type="text" id="update-actors${i}" name="actors" placeholder="Change actors..."><br><br>
                                <input type="submit" value="Update Movie" id="updateMovie${i}">
                            </form>
                        </div> <!---- FORM COLUMN ------>
                 </div>`
        }
        $('#movies').html(html);
    }


})();