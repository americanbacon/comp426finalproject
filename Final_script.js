//Javascript + jQuery
var root_url = 'http://comp426.cs.unc.edu:3001/';

//Incase someone needs this to reload bookings
//body.load('Project.html #TripSelect');


$(document).ready(function(){
  // load AJAX log in information
  $.ajax({
    type: 'POST',
    url: root_url + 'sessions/',
    data: { "user": {
                    "username": 'KTS',
                    "password": 'COMP426'
                    }
          },
    xhrFields: {withCredentials: true},
    async: true,
    success: (response) => {
      console.log('POST to sessions was a success');
    }
  });

  $('#date').mouseenter(function(){
    $('#date').datepicker();
  });

  //This function tears apart the landing page and builds the Available flight page
  $('body').on('click','#LandingGo', function(){
    //Select the body object
    let body = $('section#TripSelect');

    //We want to grab the date and the airports before clearing the body.
    let date = $('#date').val();


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


  // This function handles the your flights loading
  $('body').on('click', '#your-flights', function(){
    // send you to html for your flights.  I can't create it and have it show up
  });

  // This function handles the book flights navbar loading
  $('body').on('click', '#your-flights', function(){
    // send you to html for your flights.  I can't create it and have it show up
  });


});
