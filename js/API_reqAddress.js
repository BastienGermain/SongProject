var url ="https://api-adresse.data.gouv.fr/search/?limit=";
var nbResult = 5;
var oldAdress = "";
var address, nbSuggestion, selected;

$(document).ready(function(){

    function selectSuggestion(key) {
            if (key == 40) {
                selected = (selected == nbSuggestion) ? 0 : selected+1;
            } else if (key == 38) {
                selected = (selected == 0) ? nbSuggestion : selected-1;
            }
            var index = selected+1;
            var selectedValue = $('.search__singleResult:nth-child('+index+')');
            if (selected == nbSuggestion) {
                $("#search").val( address );
            } else {
                $("#search").val( selectedValue.text() );
            }
            $('.search__singleResult.selected').removeClass('selected');
            selectedValue.addClass('selected');
    }

    /* Corrige le retour du curseur */
    $("#search").keydown(function(e) {
        if (e.which == 38 || e.which == 40) 
        return false;
    });

    $("#search").keyup(function(e) {
        if (e.which !== 38 && e.which !== 40) {
            address = $("#search").val();
            if (address !== oldAdress) {
                oldAdress = address;
                var req = url + nbResult + "&q=" + address;
                $.ajax({
                    url: req,
                    success: function(data) {
                        $(".search__results").empty();
                        var suggestion = data['features'];
                        nbSuggestion = suggestion.length;
                        if (nbSuggestion !== 0) {
                            for (var i = 0; i < nbSuggestion; i++) {
                                $(".search__results").append('<div class="search__singleResult" id="' + suggestion[i]['properties']['id'] + '">' + suggestion[i]['properties']['label'] + '</div>');
                            }  
                        }
                        selected = nbSuggestion;
                        
                    }, 
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR, textStatus, errorThrown)
                    }
                });
            } else {
                selectSuggestion(e.which);
            }
        }
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
