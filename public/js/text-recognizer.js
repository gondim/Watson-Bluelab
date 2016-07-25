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
    //quando ele recebe a fala,ela vai comeca a fala,logo eu desligo pra nao da buxo
    console.log("readytoTalk -> " + readytoTalk);
    if(isRun == true && readytoTalk == true)
    		recordbutton.click();
    //quando termina de fala,o watson,ele liga pra ouvir a parada toda
    audio.onended = function() {
    	if(isRun == false && readytoTalk == true)
    		recordbutton.click();
	};


}

});
