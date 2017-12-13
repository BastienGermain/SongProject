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
            }
        } else {
            selectSuggestion(e.which);
        }
    });

    $('body').on('click', '.listen', function(){
        console.log($(this).data("track"));
        turnBox(90);
    });
});
