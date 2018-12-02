//Javascript + jQuery
var root_url = 'http://comp426.cs.unc.edu:3001/';

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
      alert('success!');
    }
  });

  $('#date').hover(function(){
    $('#date').datepicker();
  });

  //This function tears apart the landing page and builds the Available flight page
  $('#LandingGo').click(function(){
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
