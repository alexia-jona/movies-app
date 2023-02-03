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

let updatedMovies;
    $('#submitMovie').on('click', async function (e) {
        e.preventDefault();
        // makeMovieObj();
        let addedMovie = await addMovie(makeMovieObj());

        updatedMovies = await getUpdatedMovies()
        movies = updatedMovies
        console.log(makeMovieObj());
        await populateMovies(movies);
        console.log(updatedMovies, 'updated movies');
        console.log(movies, 'OG movies');

        $('#input-title').val('');
        $('#input-genres').val('');
        $('#input-actors').val('');



        removeMovie(movies);
        editMovie(movies);


    });



    removeMovie(movies);
    editMovie(movies);



////////// FUNCTIONALITY FUNCTIONS //////////////

function removeMovie(arr)
{
    for (let i = 0; i < arr.length; i++) {
        $(`#deleteMovieBtn${i}`).on('click', async function (e) {
            e.preventDefault()

            console.log(i)
            let deleteCheck = confirm('Are you sure you wish to delete this movie?');

            if(deleteCheck)
            {
                await deleteMovie(arr[i]);
                console.log(deleteCheck);
                location.reload();
            }


        })
    }
}


function editMovie(arr)
{
    for(let i = 0; i < arr.length; i++)
    {
        $(`#updateMovieBtn${i}`).on('click', function(e)
        {
            e.preventDefault();
            $(`#movie${i}`).toggleClass('hidden');
            $(`#update-form${i}`).toggleClass('hidden');

        });
         $(`#updateMovie${i}`).on('click', function(e)
        {
            e.preventDefault();
            $(`#movie${i}`).toggleClass('hidden');
            $(`#update-form${i}`).toggleClass('hidden');

        });



    }


}



    async function populateMovies(arr) {
        html = '';
        for (let i = 0; i < arr.length; i++) {

            html += `<div class="row" id="movies">
                    <div class="column" id="movie${i}">
                    <button id="deleteMovieBtn${i}">X</button>
                        <div id="title">${arr[i].title}</div>
                        <div id="movie-poster"></div>
                        <div id="genres">${arr[i].genre}</div>
                        <div id="actors">${arr[i].actors}</div>
                    <button id="updateMovieBtn${i}" onclick="">Update</button>
                              
                         
                    </div>
                    <div class="column hidden" id="update-form${i}">
                        <form>
                           
                            <input type="text" id="update-title" name="title" placeholder="Change Title..."><br>
                           
                            <input type="text" id="update-genres" name="genres" placeholder="Change genres..."><br>
                                 
                            <input type="text" id="update-actors" name="actors" placeholder="Change actors..."><br><br>
        
                            <input type="submit" value="Update Movie" id="updateMovie${i}">
                            
                        </form>
                    
                    </div> <!---- FORM COLUMN ------>
                    
                 </div>`
        }
        $('#movies').html(html);
    }


})();