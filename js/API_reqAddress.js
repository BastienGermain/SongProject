var url ="https://api-adresse.data.gouv.fr/search/?limit=";
var limit = 5;

$(document).ready(function(){

    var address;

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

        address = $("#search").val();

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

    });

    var url_cinema = "https://data.culturecommunication.gouv.fr/api/records/1.0/search/?dataset=etablissements-cinematographiques&q=";

    $('#lyrics__form').submit(function(e) {

        e.preventDefault();
        console.log(address);

         $.ajax({
            url: url_cinema + address + "&facet=region_administrative",
            success: function(data) {
                var length = data.records.length;
                for(i = 0; i < length; i++) {
                    console.log(data.records[i].fields.nom);
                    console.log(data.records[i].fields.corrdonnees_finales[0]); // lat 
                    console.log(data.records[i].fields.corrdonnees_finales[1]); // long 

                    findAdresse(data.records[i].fields.corrdonnees_finales);
                }               
            }, 
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown)
            }
        });


        turnBox(90);
    });
});
