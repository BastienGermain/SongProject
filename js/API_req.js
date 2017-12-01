var url ="http://api.musixmatch.com/ws/1.1/track.search?apikey=0b87e68516c5e3ca3841fb358f30889c&page=1&page_size=";
var nb_result = 3;

$(document).ready(function(){

    $('#lyrics_form').submit(function(e) {

        e.preventDefault();

        var lyrics = $("#search").val();

        var req = url + nb_result + "&q_lyrics=" + lyrics;

        $.ajax({
            url: req,

            success: function (data) {
                var obj = JSON.parse(data);

                $("#result").empty();


                for(i = 0; i < nb_result; i++) {
                    $("#result").append("<p>Track : " + obj.message.body.track_list[i].track.track_name + "</p>");
                    $("#result").append("<p>Artist : " + obj.message.body.track_list[i].track.artist_name + "</p>");
                    $("#result").append("<p>Album : " + obj.message.body.track_list[i].track.album_name + "</p>");
                    $("#result").append("<button class='listen'>Listen !</button>");
                }
                turnBox(90);

            },


            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown)
            }

        });
    });

    $('body').on('click', '.listen', function(){
        turnBox(90);
    });
});
