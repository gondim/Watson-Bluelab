window.speech = {
    recognitionActive: false
};


window.speech.speak = function( message ) {
    
    if ( window['speechSynthesis'] == undefined) {
        alert("Sorry, your browser doesn't support the speech synthesis API.");
        return;   
    }
    
    this.recognizeAbort();
    setButtonState("default");
    
    var cleaned = message.replace(/['"\[\]]+/g, '');
    var tokens = cleaned.split( "." );
    
    window.speechSynthesis.cancel();
    
    for (var i=0; i<tokens.length; i++) {
        var token = tokens[i].trim();
        
        if (token.length > 0) {
            var msg = new SpeechSynthesisUtterance( tokens[i] ); 

            msg.onstart = function (event) {
                console.log('started');
                setButtonState("speaking");
            };

            msg.onend = function (event) {
                console.log('stopped token');

                if ( !window.speechSynthesis.pending ) {
                    setButtonState("default");
                    $(".playAnswer").removeClass("playing"); 
                }
            };

            window.speechSynthesis.speak(msg);
        }
    }
    
}

window.speech.stop = function() {
    
    window.speechSynthesis.cancel();
}


window.speech.recognize = function () {
    
    if ( window['webkitSpeechRecognition'] == undefined) {
        alert("Sorry, your browser doesn't support the speech recognition API.");
        return;   
    }
    console.log("recognize");

    if ( this.recognition == undefined ) {
        this.recognition = new webkitSpeechRecognition();
    }
    var recognition = this.recognition;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = function() {
        console.log(event);
        this.recognitionActive = true;
    };
    
    recognition.onerror = function(event) {
        console.log(event);
        recognitionActive = false;
        
        var msg = undefined;
        
        if (event.error === 'no-speech') {
            msg = "No speech was detected. Please try again.";
        } else if (event.error === 'audio-capture') {
            msg = "Audio capture error, do you have a microphone?";
        } else if (event.error === 'not-allowed') {
            msg = "Unable to access your microphone. Please check permissions";
        }
        
        if (msg) {
            setButtonState("default");
            alert(msg);
        }
    };
    
    recognition.onend = function() {
        console.log(event);
        recognitionActive = false;
        
        if (!window.speechSynthesis.speaking) 
            setButtonState("default");
    };
    
    recognition.onresult = function(event) {
        console.log(event);
        
        if ( window.speechSynthesis.speaking ) return;

        var result = event.results[event.results.length-1];
        var transcript = result[0].transcript;

        search( transcript, result.isFinal );

        if ( result.isFinal ) {
            window.speechSynthesis.cancel();
        }
    };
    
    this.recognitionActive = true;
    recognition.start();
}


window.speech.recognizeAbort = function () {
    if (this.recognition) {
        this.recognition.abort();
        this.recognitionActive = false;
    }
}


