var url ="http://api.musixmatch.com/ws/1.1/track.search?apikey=0b87e68516c5e3ca3841fb358f30889c&page=1&page_size="; 
var nb_result = 5;

$(document).ready(function(){

    $('#submit').on('click', function(){

        var lyrics = $("#search").val();

        var req = url + nb_result + "&q_lyrics=" + lyrics;

        $.ajax({
            url: req,

            success: function (data) {
                var obj = JSON.parse(data);

                for(i = 0; i < nb_result; i++) {
                    console.log("Result " + i + ":");
                    console.log("Track : " + obj.message.body.track_list[i].track.track_name);
                    console.log("Artist : " + obj.message.body.track_list[i].track.artist_name);
                    console.log("Album : " + obj.message.body.track_list[i].track.album_name);
                }
                
            },

         
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown)
            }

        });
    });
});
