/* Variables globales */

var oldAdress = "";
var address, nbSuggestion, selected;

/* Variables API adresse */

var url_adresse ="https://api-adresse.data.gouv.fr/search/?limit=";
var nbResult = 5;


$(document).ready(function(){

/* Selection des suggestions */

    function selectSuggestion(key) {
        if (key == 40) { /* down arrow */
            selected = (selected == nbSuggestion) ? 0 : selected + 1;
        } else if (key == 38) { /* up arrow */
            selected = (selected == 0) ? nbSuggestion : selected - 1;
        }

        var index = selected + 1;
        var selectedValue = $('.search__singleResult:nth-child(' + index + ')');

        if (selected == nbSuggestion) {
            $("#search").val(address);
        } else {
            $("#search").val(selectedValue.text());
        }

        $('.search__singleResult.selected').removeClass('selected');
        selectedValue.addClass('selected');
    }

    /* Corrige le bug du retour du curseur au début de l'input */
    $("#search").keydown(function(e) {
        if (e.which == 38 || e.which == 40)
        return false;
    });

    $("#search").keyup(function(e) {
        if (e.which !== 38 && e.which !== 40) {
            address = $("#search").val();
            if (address == "") {
                $(".search__results").empty();
            }
            else if (address !== oldAdress) {
                oldAdress = address;
                var req = url_adresse + nbResult + "&q=" + address + "&type=municipality";

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
            }
        } else {
            selectSuggestion(e.which);
        }
    });

    /* Requete API Ministère Culture (liste musées) */

    var url_musee = "https://data.culturecommunication.gouv.fr/api/records/1.0/search/?dataset=liste-et-localisation-des-musees-de-france&q=";

    function lanceRequete(valeur) {
        console.log(valeur);

         $.ajax({
            url: url_musee + valeur + "&facet=new_name&facet=nomdep",
            success: function(data) {
            
                /* Centre la map sur la ville entrée */
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode( { 'address': valeur}, function(data, status) {
                    if( status == google.maps.GeocoderStatus.OK) {
                        coordonnees_finales = data[0].geometry.location;
                        centerMap(coordonnees_finales);
                    }
                });

                if(data.nhits == 0){
                    $('#infos').append('<p>Pas de musée dans la ville</p>');
                } else {
                    var length = data.records.length;

                    for(i = 0; i < length; i++) {
                        var coordonnees_finales = data.records[i].fields.coordonnees_finales;

                        if(coordonnees_finales !== undefined) {
                            findAdresse(coordonnees_finales);
                        } else { 
                            geocoder.geocode( { 'address': data.records[i].fields.adr}, function(data, status) {
                                if( status == google.maps.GeocoderStatus.OK) {
                                    coordonnees_finales = data[0].geometry.location;
                                    findAdresse(coordonnees_finales);
                                }
                            });
                        }
                    }
                }

                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown)
            }
        });
        turnBox(90);
    }

    /* Lance la recherche à la soumission du formulaire */

    $('#address__form').submit(function(e) {
        e.preventDefault();
        lanceRequete($("#search").val());
    });

    /* Lance la recherche au click sur les suggestions */

    $('body').on('click', '.search__singleResult',function(e) {
        e.preventDefault();
        lanceRequete($(this).text());
    });


});
