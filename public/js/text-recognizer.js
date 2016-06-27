'use strict';

var getSpeech;
var readytoTalk;
$(document).ready(function() {

var audio = $('.audio').get(0);
readytoTalk = false

getSpeech = function(text){

	var URL = '/api/synthesize?voice=pt-BR_IsabelaVoice&text=' + text;

	
	//URL += '&download=true';

	audio.pause();
    audio.src = URL;


    audio.play();
    console.log("readytoTalk -> " + readytoTalk);
    if(isRun == true && readytoTalk == true)
    		recordbutton.click();

    audio.onended = function() {
    	if(isRun == false && readytoTalk == true)
    		recordbutton.click();
	};


    //console.log("heuheuehuehuehueh " + audio.duration;
}

});
