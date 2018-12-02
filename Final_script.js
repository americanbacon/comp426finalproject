//Javascript + jQuery

$(document).ready(function(){
  // load AJAX log in information


  //This function tears apart the landing page and builds the Available flight page
  $('#GOGO').click(function(){
    //Select the body object
    let body = $('section#TripSelect');

    //Empty and load new HTML stucture
    body.empty();
    body.load('AvailableFlights.html');

  });

  //This function handles the loading of the booking page
  $('body').on('click', '#flightSelect', function(){
    //Select the body object
    let body = $('section#TripSelect');

    body.empty();
    body.load('Booking_Page.html');
  });

  //This function handles the loading of the alternate page load


});
