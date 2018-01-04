/* Variables globales */

var oldAdress = "";
var address, nbSuggestion, selected;

/* Variables API adresse */

var url_adresse ="https://api-adresse.data.gouv.fr/search/?type=municipality&limit=";
var url_musee = "https://data.culturecommunication.gouv.fr/api/records/1.0/search/?dataset=liste-et-localisation-des-musees-de-france&q=ville:";

var nbResult = 5;


$(document).ready(function(){

/* Selection des suggestions */

    function selectSuggestion(key) {
        if (key == 40) { /* down arrow */
            selected = (selected == nbSuggestion) ? 0 : selected + 1;
        } else if (key == 38) { /* up arrow */
            selected = (selected == 0) ? nbSuggestion : selected - 1;
        }

        var selectedValue = $('.search__single').eq(selected);

        if (selected == nbSuggestion) {
            $("#search").val(address);
        } else {
            $("#search").val(selectedValue.children('.search__singleResult').text());
        }

        $('.search__single.selected').removeClass('selected');
        selectedValue.addClass('selected');
    }

/* Déplacement du curseur au début de l'input */

    $("#search").keydown(function(e) {
        if (e.which == 38 || e.which == 40)
        return false;
    });

/* Requête des suggestions */

    function getSuggestion(e) {
        if (e.which !== 38 && e.which !== 40) {
            address = $("#search").val();
            if (address == "") {
                $(".search__results").empty();
            }
            else if (address !== oldAdress) {
                oldAdress = address;
                var req = url_adresse + nbResult + "&q=" + address;

                $.ajax({
                    url: req,
                    success: function(data) {

                        var suggestion = data['features'];
                        nbSuggestion = suggestion.length;
                        displaySuggestion(suggestion, nbSuggestion);

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR, textStatus, errorThrown)
                    }
                });
            }
        } else {
            selectSuggestion(e.which);
        }
    }


/* Afficher les suggestions */

    function displaySuggestion(suggestion, nbSuggestion) {
        $(".search__results").empty();
        if (nbSuggestion !== 0) {
            for (var i = 0; i < nbSuggestion; i++) {
                getNbMuseum(suggestion[i]['properties']['label'], i);
                $(".search__results").append('<div class="search__single"><span class="search__singleResult">' + suggestion[i]['properties']['label'] + '</span><span class="search__singleNbMuseum"></span></div>');
            }
        }
        selected = nbSuggestion;
    }

/* Afficher le nombre de musées */

    function displayNbMuseum(nbMuseum, i) {
        var nbMuseumLabel;
        if (nbMuseum == 0) {
            nbMuseumLabel = "Pas de musée";
        } else if (nbMuseum == 1) {
            nbMuseumLabel = "1 musée";
        } else {
            nbMuseumLabel = nbMuseum + " musées";
        }
        $(".search__single").eq(i).children('.search__singleNbMuseum').html(nbMuseumLabel);
    }

/* Retourner le nombre de musées */

    function getNbMuseum(address, i) {
        $.ajax({
            url: url_musee + address,
            success: function(data) {
                nbMuseum = data.nhits;
                displayNbMuseum(nbMuseum, i);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown)
            }
        });
        
    }
/* Requete API Ministère Culture (liste musées) */


    function getMuseum(address) {

         $.ajax({
            url: url_musee + address + "&rows=100",
            success: function(data) {

                console.log(data);

                /* Centre la map sur la ville entrée */
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode( { 'address': address}, function(data, status) {
                    if( status == google.maps.GeocoderStatus.OK) {
                        coordonnees_finales = data[0].geometry.location;
                        centerMap(coordonnees_finales);
                    }
                });
                console.log(data.nhits);
                if(data.nhits == 0){
                    console.log('Pas de musée dans la ville');
                } else {
                    var length = data.records.length;

                    for(i = 0; i < length; i++) {
                        var coordonnees_finales = data.records[i].fields.coordonnees_finales;
                        var nom_musee = data.records[i].fields.nom_du_musee;
                        var horaires = data.records[i].fields.periode_ouverture;
                        var adresse_musee = data.records[i].fields.adr;
                        var site_web = data.records[i].fields.sitweb;

                        if (horaires == undefined){
                            horaires = 'Non renseignés';
                        }

                        if(coordonnees_finales !== undefined) {
                            findAdresse(coordonnees_finales, nom_musee, horaires, adresse_musee, site_web);
                        }
                    }
                }


            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown)
            }
        });
        turnBox(90);
        $("#search").trigger("blur");
    }

//////////////////////////////////////////////////////////////////
/////////////////////////                /////////////////////////
/////////////////////////   ÉVÈNEMENTS   /////////////////////////
/////////////////////////                /////////////////////////
//////////////////////////////////////////////////////////////////

/* Récupere les suggestions lorsqu'une touche est relâchée */

    $("#search").keyup(function(e) {
        getSuggestion(e);
    });
/* Lance la recherche à la soumission du formulaire */

    $('#address__form').submit(function(e) {
        e.preventDefault();
        var value = $("#search").val() || $("#search").attr("placeholder");
        getMuseum(value);
    });

/* Lance la recherche au click sur les suggestions */

    $('body').on('click', '.search__single',function(e) {
        e.preventDefault();
        getMuseum($(this).children('.search__singleResult').text());
    });


});
