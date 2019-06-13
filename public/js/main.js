$(document).ready(function(){
    $('.btn').on('click', addFavorite);
})

function addFavorite(){
    $.ajax({
        type: 'POST',
        url: '/user/addFavorite',
        data: {joke: $(this).closest(".favorite").find(".joke").text(),
                idJoke: $(this).data('id')}
    }).done(function(response){
        window.location.replace('/jokes');
    });
}