'use strict';

var count; 
var counter;
var recordbutton = document.getElementById("recordButton");

function comecarTime(){
    clearInterval(counter);
    
    count=20;
 
    counter=setInterval(timer, 1000);
  
  }

//so se usa aqui
function timer()
{
  count=count-1;
  if (count <= 0)
  {
     clearInterval(counter);
     converse("","nada");
     recordbutton.click();
     readytoTalk = false;
     return;
  }
  console.log(count);
}

  function terminarTime(){
     clearInterval(counter);
     recordbutton.click();
  }

  function limparTime(){
     clearInterval(counter);
  }