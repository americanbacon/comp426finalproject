//Javascript + jQuery
var root_url = 'http://comp426.cs.unc.edu:3001/';

//Incase someone needs this to reload bookings
//body.load('Project.html #TripSelect');

//Start of jQuery function
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
    async: false,
    success: (response) => {
      console.log('POST to sessions was a success');
    }
  });

  // GET call to airports
  let airports = {};
  $.ajax({
    type: 'GET',
    url: root_url + 'airports/',
    xhrFields: {withCredentials: true},
    async: false,
    success: (response) => {
      console.log('GET from airports endpoint was a success. ' + response.length + ' results.');
      for (let x of response){
        airports[x.city] = x;
      }
    }
  });


  //Adds calendar functionality to the Landing page
  $('body').on('mouseenter', '#date', function(){
    $('#date').datepicker();
  });


  //This function tears apart the landing page and builds the Available flight page
  $('body').on('click','#LandingGo', function(){
    //Select the body object
    let body = $('section#TripSelect');

    //We want to grab the date and the airports before clearing the body.
    let date = $('#date').val();
    let depart_from = $('#depart_from').val();
    let arrive_to = $('#arrive_to').val();
    let flight_airlineID;
    //Empty and load new HTML stucture
    body.empty();
    body.load('AvailableFlights.html');

    //Grabbing the airports and associated flights
    $.ajax({
      url: root_url + 'flights?' + 'filter[departure_id]=' + airports[depart_from].id + '&filter[arrival_id]=' + airports[arrive_to].id,
      type: 'GET',
      xhrFields: {withCredentials: true},
      async: true,
      success: (flights) => {
        //Log result to console
        console.log('Flights GET success. Returned ' + flights.length + ' results.');
        let target = $('#AvailableFlights');
        //This For-Of statement iterates through each of the flights that the AJAX call returned.
        for (let x of flights){
          // $.ajax({
          //   url: root_url + ,
          //   type: 'GET',
          //   xhrFields: {withCredentials: true},
          //   async: false,
          //   success: (airlines) => {
          //     console.log('Airlines GET success. Returned ' + airlines.length + ' results.');
          //   }
          //
          // });
          // target.append('<div class="flightDiv">Departs from: '+depart_from+'<br> Arrives to:'+ arrive_to +'</div>')
          // flight_airlineID = x.airline_id;
        }
      }
    });

  });//end of landing page GO button

  //This function handles reloading the project.HTML
  $('body').on('click', '#flightSelect', function(){
    //Select the body object
    let body = $('section#TripSelect');

    body.empty();
    body.load('Project.html #TripSelect');
  });

  //Selecting a flight div moves you to the book_page
  $('body').on('click', '.flightDiv', function(){
    //Select the body object
    let body = $('section#TripSelect');

    body.empty();
    body.load('Booking_Page.html');
  });

  //This function handles the loading of the alternate page load


  // This function handles the your flights loading
  $('body').on('click', '#your-flights', function(){
    let body = $('section#TripSelect');
    body.empty();
    body.load('Your_Flights.html');
    $('.current-item').removeClass("current-item");
    $('#your-flights').addClass("current-item");
  });

  // This function handles the book flights navbar loading
  $('body').on('click', '#book-flight', function(){
    let body = $('section#TripSelect');
    body.empty();
    body.load('Project.html #TripSelect');
    $('.current-item').removeClass("current-item");
    $('#book-flight').addClass("current-item");
  });


});
