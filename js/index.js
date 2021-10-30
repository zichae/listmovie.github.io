const MOVIES_BACKEND_URL = "http://localhost:3000/film";
const FAV_MOVIES_BACKEND_URL = "http://localhost:3000/favorite";
let moviesList = [];
let favMoviesList = [];
let errorMessage;
let loadFavourites = false;


async function getMovies(favs) {
    if (favs) {
        let url = 'http://localhost:3000/favorite/';
        let res = await fetch(url);
        favMoviesList = await res.json();
        favMovieIds = favMoviesList.map(movie => movie.id);
        url = 'http://localhost:3000/film?id=' + favMovieIds.join('&id=');
        res = await fetch(url);
        moviesList = await res.json();
        loadFavourites = true;
    }
    getMoviesFromBackend();
}



async function getMoviesFromBackend(query) {
    if (!loadFavourites) {
        try {
            let url = 'http://localhost:3000/film' + (query ? ('?q=' + query) : '');
            let res = await fetch(url);
            moviesList = await res.json();
        } catch (error) {
            console.log(error);
            $('#errorMessage').text("Tidak dapat mengload JSON");
        }
    }
    displayMoviesToHtml(moviesList);
}



async function displayMoviesToHtml(moviesList) {

    let movies = '';
    let url = 'http://localhost:3000/favorite/';
    let res = await fetch(url);
    favMoviesList = await res.json();
    favMovieIds = favMoviesList.map(movie => movie.id);

    $.each(moviesList, function(i, movie) {

        movies += '<div class="card movie_card" id=' + movie.id + '>' +
            '<img src="' + movie.posterImageUrl + '" class="card-img-top" alt="' + movie.title + '">' +
            '<div class="card-body">' +
            '<i class="fa fa-heart fav_button' + (favMovieIds.includes('' + movie.id) ? ' favorite' : '') + '" data-toggle="tooltip" data-placement="bottom" title="favorite"></i>' +
            '<h5 class="card-title">' + movie.title + '</h5>' +
            '<p class="card-text">' + movie.description + '</p>' +
            '<span class="movie_info"><i class="fa fa-user"></i> ' + movie.director + '</span>' +
            '<span class="movie_info float-right"><i class="fa fa-star"></i> ' + movie.rating + '</span></div> </div>';

    });

    $('#moviesList').html(movies);
    $('[data-toggle="tooltip"]').tooltip()
    $('.fav_button').on('click', async function() {
        fav_button = $(this);
        let id = fav_button.parent().parent().attr('id');
        if (fav_button.hasClass('favorite')) {
            $.ajax({
                url: url + id,
                type: 'DELETE',
                success: function(result) {
                    console.log('Hapus Film ' + id + ' Dari Favorite.\n', result);
                }
            });
        } else {
            $.post(url, { id: id }, function(data) {
                console.log(data);
            });
        }
        fav_button.toggleClass('favorite');
    });
}

$('#search').click(function() {
    let query = $('#query').val();
    getMoviesFromBackend(query);
});