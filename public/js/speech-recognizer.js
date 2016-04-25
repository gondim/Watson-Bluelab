
var searchTimeout = 0;


//fill and submit the form with a random example
function showExample(submit) {
  loadExample();
  if (submit)
    $('#qaForm').submit();
}

function loadQuery(query) {
  $('#questionText').val(query);
}

//fill and submit the form with a random example
function search(query, submit) {
  loadQuery(query);
    
  if (submit) {
  clearTimeout( searchTimeout );
    searchTimeout = setTimeout( function() {
        
        $('#qaForm').submit();
    }, 100 );
  }
}

function speakContent( id ) {
    
    $(".playAnswer").removeClass("playing");
    $("#"+id).addClass("playing");
    
    var element = $("#response" + id);
    var text = element.html();
    speech.speak(text);  
}

$("#qaForm").submit(function(e){
    var form = $(this);
    $.ajax({ 
         url   : form.attr('action'),
         type  : form.attr('method'),
         data  : form.serialize(), 
         success: function(response){
             $("#result").html(response);
             
             $("#result").find(".playAnswer").click( function(event) {
                 var target = $(event.target);
                 if (target.hasClass("playing")) {
                    target.removeClass("playing");    
                    speech.stop();
                 }
                 else {
                    speakContent( event.target.getAttribute("id") );
                 }
             });
         }
    });
    return false;
 });



$("#listen").click(function(e){
    
    switch (speechState) {
        case "listening": 
            window.speech.recognizeAbort();    
            setButtonState("default");
            break;
        case "speaking": 
            window.speech.stop();
            $(".playAnswer").removeClass("playing");
            setButtonState("default");
            break;
        default:
            window.speech.recognize(); 
            setButtonState("listening");
            $("#listen").blur();
            break;
    }
        
    return false;
 });

var speechState = "";

function setButtonState( state ) {
    console.log( state );
    var button = $("#listen");
    speechState = state;
    
    button.removeClass( "listen" ).removeClass( "stop" ).removeClass( "playing" );
    
    switch (state) {
        case "listening": 
            button.addClass( "stop" );
            break;
        case "speaking": 
            button.addClass( "playing" );
            break;
        default:
            button.addClass( "listen" );
            break;
    }
}
