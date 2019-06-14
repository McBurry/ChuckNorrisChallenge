var globalIntervalId = 0;

$(document).ready(function(){
    $('.nonFavoriteButton').on('click', addFavorite);

    $('.favoriteButton').on('click', removeFavorite);

    $('.randomButton').on('click', addRandomJoke);
})

//Called when user wants to add the joke to favorite
function addFavorite(){
    $.ajax({
        type: 'POST',
        url: '/user/addFavorite',
        data: {joke: $(this).closest(".non-favorite").find(".joke").text(),
                idJoke: $(this).data('id')}
    }).done(function(response){
        console.log('Joke added');

        //Remove if the joke has been added to the favorites in the DOM
        if(response.message == "worked"){
            $('.nbOfFavorites').html((response.nbOfFavorites + 1) + ' / 10 favorite jokes');

            var $row = $('<div class="row justify-content-center align-items-center favorite">'+
                            '<div class="col col-md-8"><a href="#" class="joke list-group-item list-group-item-warning">' + response.joke + '</a></div>' +
                            '<div class="col-auto col-md-1"><button data-id="' + response.idJoke + '" type="button" class="favoriteButton btn btn-success" data-toggle="button" aria-pressed="false" autocomplete="off">Favorite</button></div>' +
                        '</div>');

            //Add the new joke to the favorites
            $(".favoriteContainer").append($row);

            //Display information about the action
            $('.favoriteButton').on('click', removeFavorite);

            if(response.success){
                var $row = $('<div class="container-fluid">' +
                        '<div class="row justify-content-center">' +
                        '<div class="col-auto col-md-8"><div class="infoZone alert alert-dismissible alert-success fade show" role="alert">' + 
                        response.success +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div>' +
                        '</div>' +
                        '</div>');

                //Add the new joke to the favorites
                $(".nameTitle").after($row);
            }
            if(response.alert){
                var $row = $('<div class="container-fluid">' +
                        '<div class="row justify-content-center">' +
                        '<div class="col-auto col-md-8"><div class="infoZone alert alert-dismissible alert-danger fade show" role="alert">' + 
                        response.alert +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div>' +
                        '</div>' +
                        '</div>');

                //Add the new joke to the favorites
                $(".nameTitle").after($row);
            }
        }else{
            
        }

    });
}

//Called when the user wants to remove the joke from the favorites
function removeFavorite(){
    $.ajax({
        type: 'POST',
        url: '/user/removeFavorite',
        data: {joke: $(this).closest(".favorite").find(".joke").text(),
                idJoke: $(this).data('id')}
    }).done(function(response){
        console.log('Joke removed');

        //If the joke has been removed from the database
        if(response.message == "worked"){
            $('.nbOfFavorites').html((response.nbOfFavorites - 1) + ' / 10 favorite jokes');
            
            //Remove the joke from the favorites on the DOM
            $('[data-id="'+response.idJoke+'"]').closest(".favorite").remove();
        }else{

        }

        if(response.success){
            var $row = $('<div class="container-fluid">' +
                    '<div class="row justify-content-center">' +
                    '<div class="col-auto col-md-8"><div class="infoZone alert alert-dismissible alert-success fade show" role="alert">' + 
                    response.success +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div>' +
                    '</div>' +
                    '</div>');

            //Add the new joke to the favorites
            $(".nameTitle").after($row);
        }
        if(response.alert){
            var $row = $('<div class="container-fluid">' +
                    '<div class="row justify-content-center">' +
                    '<div class="col-auto col-md-8"><div class="infoZone alert alert-dismissible alert-danger fade show" role="alert">' + 
                    response.alert +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div>' +
                    '</div>' +
                    '</div>');

            //Add the new joke to the favorites
            $(".nameTitle").after($row);
        }

    });
}

//Called when user wants to add a random joke to the list of favorites
function addRandomJoke(){

    //If the interval isn't activated
    if(globalIntervalId == 0){

        //Change the button appearance
        $('.randomButton').addClass('btn-success').removeClass('btn-danger');
        $('.randomButton').text('On');

        //Start an interval set to every 5 secs
        globalIntervalId = setInterval(function(){
            $.ajax({
                type: 'GET',
                url: '/user/addRandomJoke',
                data: {joke: $(this).closest(".favorite").find(".joke").text(),
                        idJoke: $(this).data('id')}
            }).done(function(response){
                console.log('Random added');
        
                //If the joke has been added to the database
                if(response.message == "worked"){
                    $('.nbOfFavorites').html((response.nbOfFavorites + 1) + ' / 10 favorite jokes');
        
                    var $row = $('<div class="row justify-content-center align-items-center favorite">'+
                                    '<div class="col col-md-8"><a href="#" class="joke list-group-item list-group-item-warning">' + response.joke + '</a></div>' +
                                    '<div class="col-auto col-md-1"><button data-id="' + response.idJoke + '" type="button" class="favoriteButton btn btn-success" data-toggle="button" aria-pressed="false" autocomplete="off">Favorite</button></div>' +
                                '</div>');
        
                    //Add the joke to the favorites in the DOM
                    $(".favoriteContainer").append($row);

                }else{
                    
                }

                if(response.success){
                
                    var $row = $('<div class="container-fluid">' +
                            '<div class="row justify-content-center">' +
                            '<div class="col-auto col-md-8"><div class="infoZone alert alert-dismissible alert-success fade show" role="alert">' + 
                            response.success +
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div>' +
                            '</div>' +
                            '</div>');

                    //Add the new joke to the favorites
                    $(".nameTitle").after($row);
                    
                }
                if(response.alert){
                    var $row = $('<div class="container-fluid">' +
                            '<div class="row justify-content-center">' +
                            '<div class="col-auto col-md-8"><div class="infoZone alert alert-dismissible alert-danger fade show" role="alert">' + 
                            response.alert +
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div>' +
                            '</div>' +
                            '</div>');
    
                    //Add the new joke to the favorites
                    $(".nameTitle").after($row);
                }
        
                if((response.nbOfFavorites+1) >= 10){
                    $('.randomButton').removeClass('btn-success').addClass('btn-danger');
                    $('.randomButton').text('Off');
                    clearInterval(globalIntervalId);
                    globalIntervalId = 0;
                }
            });
        }, 5000);
    }else{
        $('.randomButton').removeClass('btn-success').addClass('btn-danger');
        $('.randomButton').text('Off');
        clearInterval(globalIntervalId);
        globalIntervalId = 0;
    }
    
}