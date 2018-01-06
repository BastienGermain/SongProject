/* Variables globales */

var oldAdress = "";
var address, nbSuggestion, selected;
var filtreWeb = new RegExp( /((w{3}\.)[\w./\-%~=#@]+(\.fr))/,'g');

/* Variables API adresse */

var url_adresse ="https://geo.api.gouv.fr/communes?fields=code,nom,surface,codesPostaux&nom=";
var url_musee = "https://data.culturecommunication.gouv.fr/api/records/1.0/search/?dataset=liste-et-localisation-des-musees-de-france&q=";

var nbResult = 5;


$(document).ready(function(){

/* Suppression du contenu de l'input */

    function resetInput() {
        $(".search__results").empty();
        $("#search").val("").parent().addClass("empty");
    }

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
                resetInput();
            } else {
                $("#search").parent().removeClass("empty");
            }

            if (address !== oldAdress) {
                oldAdress = address;
                var req = url_adresse + address;

                $.ajax({
                    url: req,
                    success: function(data) {

                        var suggestion = data.slice(0, nbResult);
                        nbSuggestion = suggestion.length;
                        displaySuggestion(suggestion, nbSuggestion);

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR, textStatus, errorThrown);
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
                var value = [suggestion[i]['nom'], suggestion[i]['codesPostaux']];
                getNbMuseum(value, i);
                $(".search__results").append('<div class="search__single"><span class="search__singleResult" data-cp="' + value[1] + '">' + value[0] + '</span><span class="search__singleNbMuseum"></span></div>');
            }
        }
        selected = nbSuggestion;
    }

/* Afficher le nombre de musées */

    function displayNbMuseum(nbMuseum, i) {
        var nbMuseumLabel;
        if (nbMuseum == 0) {
            nbMuseumLabel = "Pas de musée";
            $(".search__single").eq(i).addClass('disabled');
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
            url: url_musee + getRequestUrl(address) + "&rows=100",
            success: function(data) {
                nbMuseum = data.nhits;
                displayNbMuseum(nbMuseum, i);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            }
        });

    }

    function getRequestUrl(address) {
        var request = "";
        for (var i =  0; i < address[1].length; i++) {
            request += address[0] + ' AND ' + address[1][i];
            if (i != address[1].length-1) {
                 request += ' OR ';
            }
        }
        return request;
    }
/* Requete API Ministère Culture (liste musées) */


    function getMuseum(address) {
        $.ajax({
            url: url_musee + getRequestUrl(address) + "&rows=100",
            success: function(data) {

                console.log(data);

                /* Centre la map sur la ville entrée */
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode( { 'address': address[0]}, function(data, status) {
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

                      geoCode(data, i);

                    }
                }



            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            }
        });
        turnBox(90);
        $("#search").trigger("blur");
    }

/* Place les musées selon les coordonnées trouvées à partir de leur adresse avec leurs infos.
Si les coordonnées ne sont pas trouvées, les coordonnées fournies par défaut par l'API (parfois erronées) sont utilisées */

    function geoCode(data, i) {

      var coord_alt = data.records[i].fields.coordonnees_finales;
      var nom_musee = data.records[i].fields.nom_du_musee;
      var horaires = data.records[i].fields.periode_ouverture;
      var adresse_musee = data.records[i].fields.adr + " " + data.records[i].fields.cp + " " + data.records[i].fields.ville;
      console.log(data.records[i].fields.sitweb);
      var site_web = data.records[i].fields.sitweb.match(filtreWeb);
      console.log(site_web);
      var coordonnees_finales;

      if (horaires == undefined){
          horaires = 'Non renseignés';
      }

      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': adresse_musee }, function(data, status) {
          if( status == google.maps.GeocoderStatus.OK) {
              coordonnees_finales = data[0].geometry.location;
          } else {
              coordonnees_finales = coord_alt;
          }
          findAdresse(coordonnees_finales, nom_musee, horaires, adresse_musee, site_web);
          centerMapToMarkers();
      });
    }

//////////////////////////////////////////////////////////////////
/////////////////////////                /////////////////////////
/////////////////////////   ÉVÈNEMENTS   /////////////////////////
/////////////////////////                /////////////////////////
//////////////////////////////////////////////////////////////////

/* Retourne à la recherche */

    $('.clear__input').click(function() {
        resetInput();
    });

/* Efface le contenu de l'input */

    $('.map_sideBar').click(function() {
        turnBox(-90);
        deleteMarkers();
    });

/* Récupere les suggestions lorsqu'une touche est relâchée */

    $("#search").keyup(function(e) {
        getSuggestion(e);
    });

/* Lance la recherche à la soumission du formulaire */

    $('#search__form').submit(function(e) {
        e.preventDefault();
        var value = $("#search").val() || $("#search").attr("placeholder");
        var req = url_adresse + value;

        $.ajax({
            url: req,
            success: function(data) {

                var suggestion = data.slice(0, 1);
                var adresse_cp = [suggestion[0]['nom'], suggestion[0]['codesPostaux']];
                console.log(adresse_cp);
                getMuseum(adresse_cp);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            }
        });
    });

/* Lance la recherche au click sur les suggestions */

    $('body').on('click', '.search__single',function(e) {
        e.preventDefault();
        var value = [$(this).children('.search__singleResult').text(), $(this).children('.search__singleResult').data("cp").split(',')];
        console.log(value);
        getMuseum(value);
    });


});
