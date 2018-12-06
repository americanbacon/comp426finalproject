//Javascript + jQuery
var root_url = 'http://comp426.cs.unc.edu:3001/';
var plane_id;
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
  let airportsList = [];
  let airportsDictionary = {};
  $.ajax({
    type: 'GET',
    url: root_url + 'airports/',
    xhrFields: {withCredentials: true},
    async: false,
    success: (response) => {
      console.log('GET from airports endpoint was a success. ' + response.length + ' results.');
      for (let x of response){
        airportsList.push(x.code.toUpperCase() +':'+x.city);
        airportsDictionary[x.code] = x;
      }
      airportsList.sort();
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
    let depart_from = $('#depart_from').val().split(" ");
    let arrive_to = $('#arrive_to').val().split(" ");
    let flight_airlineID;
    //Empty and load new HTML stucture
    body.empty();
    body.load('AvailableFlights.html');

    //Grabbing the airports and associated flights
    $.ajax({
      url: root_url + 'flights?filter[departure_id]=' + airportsDictionary[depart_from[0]].id + '&filter[arrival_id]=' + airportsDictionary[arrive_to[0]].id,
      type: 'GET',
      xhrFields: {withCredentials: true},
      async: false,
      success: (flights) => {
        //Log result to console
        console.log('Flights GET success. Returned ' + flights.length + ' results.');
        let target = $('#AvailableFlights');
        //This For-Of statement iterates through each of the flights that the AJAX call returned.
        for (let x of flights) {
          let depart_time = x.departs_at;
          let arrive_time = x.arrives_at;
          $.ajax({
            url: root_url + 'airlines/'+ x.airline_id,
            type: 'GET',
            xhrFields: {withCredentials: true},
            async: false,
            success: (airline) => {
              //Logging result of AJAX call to console.
              console.log('Airlines GET success. Returned ' + airline.length + ' results.');

              let flight_div = $('<div class="flightDiv"></div>');
              target.append(flight_div);
              flight_div.append('<p>Departs from: ' +depart_from+'</p>');
              flight_div.append('<p>Arrives to: ' + arrive_to +'</p>');
              flight_div.append('<p>Airline: ' + airline.name + '</p>');
              flight_div.append('<p>Date:'+ date +'</p>');

              plane_id = airline.plane_id;
              //Things we want to still add: Date, time,
            }

          });

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

    alert(plane_id);
  });

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

$("body").on("keyup", "input", function () {
  let autocomplete_div =$(this).parent().find('.autocomplete-list');
  autocomplete_div.empty();
  let items = [];
  let length = 0;
  // console.log(items);
  let text = $(this).val().toLowerCase();
  if (text) {
    autocomplete_div.css('display', 'block');
    for(let airport of airportsList) {
      if (airport.toLowerCase().includes(text)){
        length = items.push(airport);
      }
    }
    for(let i = 0; i < Math.min(items.length, 10); i++) {
      let item = $('<div class="item"></div>');
      let strings = items[i].split(":");
      item.html(strings[0].toUpperCase() + " " + strings[1]);
      // append items[i] to list;
      autocomplete_div.append(item);
    }
    $(this).parent().append(autocomplete_div);
  } else {
    autocomplete_div.css('display', 'none');
  }
});

$('body').on('click', '.item', function() {
  $(this).parent().parent().find('.autocomplete-list').css('display', 'none');
  let string = $(this).html();
  $(this).parent().parent().find(':input').val(string);
  $(this).parent().empty();
});

});

// Doesn't work fix
function titleCase(str) {
  return str.replace(/\w\S/g, function(t) { return t.toUpperCase() });
}
