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
    let depart_from = $('#depart_from').val();
    let arrive_to = $('#arrive_to').val();
    

    //Empty and load new HTML stucture
    body.empty();
    body.load('AvailableFlights.html');
    
    console.log(depart_from, arrive_to)
    let departID;
    let arriveID; 
    $.ajax({
      type: 'GET',
      url: root_url + 'airports',
      xhrFields: {withCredentials: true},
      success: (response) => {
        let airport = response;
        for(var i=0; i < airport.length; i++){
            if (airport[i].code === depart_from) {
                departID = airport[i].id; 
            }
            if (airport[i].code === arrive_to) {
                arriveID = airport[i].id; 
            }
        }
      console.log(departID, arriveID);
      },
      error: () => {
        alert('failed to load airports')
      }
    });
    $.ajax({
      type: 'GET',
      url: root_url + 'flights',
      xhrFields: {withCredentials: true},
      success: (response) => {
        let flights = response;
        for(var i=0; i < flights.length; i++){
            if (flights[i].departure_id == departID && flights[i].arrival_id == arriveID ) {
              let fdiv = $('<div class="available_flight" id="fid_' + flights[i].number + '"></div>');
              fdiv.append('<div class="flight_number">Flight Number: ' + flights[i].number + '</div>');
              fdiv.append('<div class="dep_time">Departs At: ' + flights[i].departs_at + '</div>');
              fdiv.append('<div class="arr_time">Arrives At: ' + flights[i].arrives_at + '</div>');
              fdiv.append('<button class="select_flight">View</button>')
              body.append(fdiv);
            }
        }
      },
      error: () => {
        alert('failed to load flights')
      }
    });
 
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
