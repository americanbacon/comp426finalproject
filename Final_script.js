//Javascript + jQuery

$(document).ready(function(){

  //This function tears apart the landing page and builds the Available flight page
  $('#GOGO').click(function(){
    //Grab body object
    let body = $('body');

    //Empty and load new HTML stucture
    body.empty();
    body.load('AvailableFlights.html');

  });
  // load AJAX log in information

  $('#push').click(function(){

  });


});
