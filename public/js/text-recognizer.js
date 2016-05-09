'use strict';

var getSpeech;

$(document).ready(function() {

var audio = $('.audio').get(0);

getSpeech = function(text){

	var URL = 'https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=pt-BR_IsabelaVoice&text=' + text;

	console.log('Falando' + text);
	//URL += '&download=true';

	audio.pause();
    audio.src = URL;
    audio.play();

}

});