var url ="http://api.musixmatch.com/ws/1.1/track.search?apikey=0b87e68516c5e3ca3841fb358f30889c&page=1&page_size=";
var nb_result = 3;

$(document).ready(function(){

    $('#lyrics_form').submit(function(e) {

        e.preventDefault();

        var lyrics = $("#search").val();

        var req = url + nb_result + "&q_lyrics=" + lyrics;

        $.ajax({
            url: req,
            success: function(data) {

                var obj = JSON.parse(data);
                console.log(obj.message.body);

                $("#result").empty();

                for(i = 0; i < nb_result; i++) {
                    var result = obj.message.body.track_list[i].track;

                    $("#result").append("<p>Track : " + result.track_name + "</p><p>Artist : " + result.artist_name + "</p><p>Album : " + result.album_name + "</p><button class='listen' data-track='" + result.track_id + "'>Listen !</button>");
                }
                
                turnBox(90);
                
            }, 
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown)
            }

        });
    });

    $('body').on('click', '.listen', function(){
        console.log($(this).data("track"));
        turnBox(90);
    });
});
