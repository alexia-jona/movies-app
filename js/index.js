(async () => {
    // This is the entry point for your application. Write all of your code here.
    // Before you can use the database, you need to configure the "db" object
    // with your team name in the "js/movies-api.js" file.



    let movies = await getMovies();

    console.log(movies);

    let html = '';
    for(let movie of movies)
    {




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


})();