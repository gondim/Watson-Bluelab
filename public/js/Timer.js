'use strict';

var count; 
var counter;
var recordbutton = document.getElementById("recordButton");

function comecarTime(){
    clearInterval(counter);
    
    count=10;
 
    counter=setInterval(timer, 1000);
  
  }


function timer()
{
  count=count-1;
  if (count <= 0)
  {
     clearInterval(counter);
     converse("","nada");
     recordbutton.click();
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