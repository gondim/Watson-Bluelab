'use strict';

var getSpeech;

$(document).ready(function() {

var audio = $('.audio').get(0);

getSpeech = function(text){

	var URL = '/api/synthesize?voice=pt-BR_IsabelaVoice&text=' + text;

	console.log('Falando -> ' + text);
	//URL += '&download=true';

	audio.pause();
    audio.src = URL;

    audio.play();
    //console.log("heuheuehuehuehueh " + audio.duration;
}

});
