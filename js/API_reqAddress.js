var url ="https://api-adresse.data.gouv.fr/search/?limit=";
var limit = 5;

$(document).ready(function(){

    function selectSuggestion(nbSuggestion, inputValue, key) {
            var inputDefault = inputValue;
            console.log(nbSuggestion, inputValue, key);
    }

    /* Corrige le retour du curseur */   
    $("#search").keydown(function(e) {
        if (e.keyCode === 38 || e.keyCode === 40) 
        return false;
    });

    $("#search").keyup(function(e) {

        var pos = this.selectionStart;

        var address = $("#search").val();

        var req = url + limit + "&q=" + address;
        $.ajax({
            url: req,
            success: function(data) {
                $(".search__results").empty();
                var suggestion = data['features'];
                if (suggestion.length !== 0) {
                    for (var i = 0; i < suggestion.length; i++) {
                        $(".search__results").append('<div class="search__singleResult" id="' + suggestion[i]['properties']['id'] + '">' + suggestion[i]['properties']['label'] + '</div>');
                    }
                    if (e.which == 38 || e.which == 40) {
                        selectSuggestion(suggestion.length, address, e.which);
                    }
                }
                
            }, 
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown)
            }

        });

        this.selectionStart = pos; this.selectionEnd = pos;
    });

    $('body').on('click', '.listen', function(){
        console.log($(this).data("track"));
        turnBox(90);
    });
});
