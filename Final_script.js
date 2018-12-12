//Javascript + jQuery
var root_url = 'http://comp426.cs.unc.edu:3001/';

//Start of jQuery function
$(document).ready(function(){

  $('body').on('click', '.kitty', function(){
    $.ajax({
      url: 'https://api.thecatapi.com/v1/images/search',
      type: 'GET',
      async: true,
      data:{
        APIkey: 'cbaba604-169b-4264-89fa-0dc9865dea0f'
      },
      success: (kitty) => {
        let target = $('section#TripSelect');
        target.html('<img class="kitty" src="'+kitty[0].url+'"/>');
      }
    });
  });

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
    console.log(date);
    let depart_from = $('#depart_from').val().split(" ", 1); // ONLY GRABS ID
    console.log(depart_from);
    let arrive_to = $('#arrive_to').val().split(" ", 1); // ONLY GRABS ID
    console.log(arrive_to);
    let flight_airlineID;
    if (!date || !$('#depart_from').val() || !$('#arrive_to').val()) {
      let modal = $('#error_message');
      modal.css("display", "block");
      modal.find('.message').html("Please fill in all of the text boxes.");
      modal.find('#close').on('click', function() {
        modal.css('display', 'none');
      });
      $(window).on('click', function(e) {
        if (e.target.id === modal.attr('id')){
          modal.css('display', 'none');
        }
      });
    } else {
    //Empty and load new HTML stucture
    body.empty();

    let toAppend = '<h2>Available Flights</h2>'+
                    '<div id="AvailableFlights"></div>'+
                    '<button class="button" type="submit" id="flightSelect">Search Again</button>';
    let no_flights = $('<span id="no-flights">There are no flights between these two airports! Please search again!</span>');
    no_flights.css('display', 'none');
    body.append(toAppend);
    $('#AvailableFlights').append(no_flights);

    //Grabbing the airports and associated flights
    $.ajax({
      url: root_url + 'flights?filter[departure_id]=' + airportsDictionary[depart_from[0]].id + '&filter[arrival_id]=' + airportsDictionary[arrive_to[0]].id,
      type: 'GET',
      xhrFields: {withCredentials: true},
      async: false,
      success: (flights) => {
        //Log result to console
        console.log('Flights GET success. Returned ' + flights.length + ' results.');
        //This For-Of statement iterates through each of the flights that the AJAX call returned.
        if (flights.length == 0){
          no_flights.css('display', 'block');
        } else {
          console.log(flights);
          $("#no-flights").css('display', 'none');
        for (let x of flights){
          console.log(x);
          let arrival_time = x.arrives_at;
          let departure_time = x.departs_at;
          $.ajax({
            url: root_url + 'airlines/'+ x.airline_id,
            type: 'GET',
            xhrFields: {withCredentials: true},
            async: false,
            success: (airline) => {
              //Logging result of AJAX call to console.
              console.log('Airlines GET success. Returned results for: ' + airline.name);
              let flight_div = $('<div class="flightDiv" data-flightID="' + x.id + '" data-planeID="'+x.plane_id+'" data-depCity="'+airportsDictionary[depart_from[0]].city+'" data-arrCity="'+airportsDictionary[arrive_to[0]].city+'"></div>'); // We add the planeID as a data field to get seats later on.
              $('#AvailableFlights').append(flight_div);
              let div1 = $('<div class="div1"></div>');
              let div2 = $('<div class="div2"></div>');
              let div3 = $('<div class="div3"><img src="images/Logos/'+ airline.name +'.jpg" width="120" height="100"></div>');

              div1.append('<h3>'+ getTime(departure_time) + ' - ' + getTime(arrival_time) + '</h3>');
              div1.append('<p>' + airline.name + '</p>');
              div2.append('<h3>' + timeOfFlight(departure_time, arrival_time) + '</h3>');
              div2.append('<p>' + depart_from[0] + ' - ' + arrive_to[0] + '</p>');

              flight_div.append(div1);
              flight_div.append(div2);
              flight_div.append(div3);
            }
          });
        }
      }
      }
    });
  }
  });//end of landing page GO button


  //This function handles reloading the project.HTML
  $('body').on('click', '#flightSelect', function(){
    //Select the body object
    let body = $('section#TripSelect');

    body.empty();
    body.load('project.html #TripSelect');
  });


  //Selecting a flight div moves you to the book_page
  $('body').on('click', '.flightDiv', function(){
    //Grab plane ID and city's of the flight to output weather and seat information.
    let flightID = $(this).attr('data-flightID');
    let planeID = $(this).attr('data-planeID');
    let depart_city = $(this).attr('data-depCity');
    let arrival_city = $(this).attr('data-arrCity');
    let a_time = $(this).attr('data-departT');
    let b_time = $(this).attr('data-arriveT');
    let airline = $(this).attr('data-airline');
    //Select the body object
    let body = $('section#TripSelect');

    body.empty();
    let toAppend = ('<h2 id="seatSelection">Flight Summary</h2><div id="flight_info"></div>');
    body.append(toAppend);

    $('#flight_info').append('<div id="weather"><div>')
    //Call to the Weather API for departure city
    $.ajax({
      url: 'http://api.openweathermap.org/data/2.5/weather?',
      type: 'GET',
      async: false,
      data:{
        q: depart_city,
        APIkey: '8b6c274b00e8abebf93f9a832f420de1',
        units: 'imperial'
      },//This will be the city variable that we had from the earlier portion
      success: (departure) => {
        let temp = departure.main;
        console.log('GET call to openweather for '+ depart_city+' was a success.');
        console.log(departure.weather);
        //want to manipulate the JSON that was returned in the response.
        //Here is some sample information output to the console
        console.log(departure.main.temp);
        console.log(departure.main.temp_min);
        console.log(departure.main.temp_max);
        let string = "";
        for (let i = 0; i < departure.weather.length; i++) {
          string += departure.weather[i].description;
          if (i != departure.weather.length - 1){
            string += ", ";
          }
        }
        string = capitalizeFirst(string);
        console.log(string);
        $('#weather').append('<h2 class="weather-title">Weather</h2>');
        $('#weather').append('<div class="clearfix"></div>')
        $('.clearfix').append('<div id="departure"><h3 class="weather-header">'+depart_city+'</h3><p class="weather-subtitle">'+string+'</p><h1>'+Math.round(temp.temp)+'&#176;F</h1><p>High: '+Math.round(temp.temp_max)+'&#176;F  Low: '+Math.round(temp.temp_min)+'&#176;F</p></div>');
        $('.clearfix').append('<div class="divider"></div>')
      }
    });

    //Call to weather API for arrival city
    $.ajax({
      url: 'http://api.openweathermap.org/data/2.5/weather?',
      type: 'GET',
      async: false,
      data:{
        q: arrival_city,
        APIkey: '8b6c274b00e8abebf93f9a832f420de1',
        units: 'imperial'
      },//This will be the city variable that we had from the earlier portion
      success: (arrival) => {
        let temp = arrival.main;
        console.log('GET call to openweather for '+ arrival_city+' was a success.');
        //want to manipulate the JSON that was returned in the response.
        //Here is some sample information output to the console
        console.log(arrival.main.temp);
        console.log(arrival.main.temp_min);
        console.log(arrival.main.temp_max);
        let string = "";
        for (let i = 0; i < arrival.weather.length; i++) {
          string += arrival.weather[i].description;
          if (i != arrival.weather.length - 1){
            string += ", ";
          }
        }
        string = capitalizeFirst(string);
        console.log(string);
        $('.clearfix').append('<div id="arrival"><h3 class="weather-header">'+arrival_city+'</h3><p class="weather-subtitle">'+string+'</p><h1>'+Math.round(temp.temp)+'&#176;F</h1><p>High: '+Math.round(temp.temp_max)+'&#176;F  Low:'+Math.round(temp.temp_min)+'&#176;F</p></div>');
      }
    });

    //This AJAX call uses the plane ID's found earlier to find available seats
    let cabins = [];
    let rows = [];
    let columns = [];
    $.ajax({
      url: root_url + 'seats?filter[plane_id]='+ planeID,
      type: 'GET',
      async: false,
      xhrFields: {withCredentials: true},
      success: (seats) => {
        //Log result of seat GET request with plane_id filter
        console.log('GET from seats was a success. Returned: '+ seats.length +' results.');

        let targetDiv = $('<div class="seatDiv"></div>');
        $('#flight_info').append(targetDiv);
        targetDiv.append('<h3>There are '+seats.length+' available seats on this flight</h3>');
        targetDiv.append('<div class="seats"></div');
        //This runs through all the seats and appends them to the targetDiv.
        for (let seat of seats){
          if (!cabins.includes(seat.cabin)){
            cabins.push(seat.cabin);
          }
          if (!rows.includes(seat.row)) {
            rows.push(seat.row);
          }
          if (!columns.includes(seat.number)) {
            columns.push(seat.number);
          }
        }
        //for (let cabin of cabins) {
          //$('.seats').append('<div id="' + cabin + '"></div>');
        //}

        rows.sort(function(a, b){return a-b});
        columns.sort();
        console.log(cabins);
        console.log(seats);
        console.log('rows='+rows);
        console.log('cols ='+columns);

        var counter;
        var array = new Array();

        for (var i=0; i<rows.length; i++){
             $('.seatDiv').append('<tr></tr>');
             array[i] = new Array()
             var counter
             for (var j=0; j<columns.length; j++){
               counter = 0;
               for (let seat of seats){
                 if (seat.row == rows[i] && seat.number == columns[j]) {
                   $('.seatDiv').append('<td><p class="book_seat" id='+seat.id+' data-flightID='+flightID+' data-airline='+airline+' data-timeDEP='+a_time+' data-timeARR='+b_time +' data-ARRcity='+arrival_city+' data-DEPcity='+depart_city+'>Cabin:'+seat.cabin+'<br>Row:'+ seat.row+ '<br>Number:' + seat.number +'</p></td>');
                   counter = 1;
                   array[i][j] = seat;
                 } else {
                   array[i][j]=0;
                 }
               }
               if(counter == 0){
                 $('.seatDiv').append('<td><p class="book_seat"</p> <br><br><br><br></td>');
               }
             }
           }


        }//end of success
    }); // end of AJAX


    $('.book_seat').on('click', function(){

      let seat_id = $(this).attr('id');

      let modal = $('#conf_message');
      modal.css("display", "block");
      modal.find('.message').html("Would you like to book this seat?");
      modal.find('#yes').on('click', function() {
        modal.css('display', 'none');
        $.ajax({
          type: 'PUT',
          url: root_url + 'seats/'+ seat_id,
          xhrFields: {withCredentials: true},
          dataType: "json",
          data: {
            "seat": {
              "info": flightID
            }
          },
          async: false,
          success: (seats) => {
            console.log(seats);
            $.ajax({
               type: 'PUT',
               url: root_url + 'flights/'+ flightID,
               xhrFields: {withCredentials: true},
               dataType: "json",
               data: {
                 "flight":{
                   "info" : "booked"
                 }
               },
               async: false,
               success: (flights) => {
                 console.log(flights);
               },
               error: (error) => { console.error(error)}
             });
            yourFlights();
          },
          error: (error) => { console.error(error)}
        });

      });
      modal.find('#no').on('click', function () {
        modal.css('display', 'none');
      });
      $(window).on('click', function(e) {
        if (e.target.id === modal.attr('id')){
          modal.css('display', 'none');
        }
      });
  });
});

  // This function handles the your flights loading
  $('body').on('click', '#your-flights', function() {
    yourFlights();
  });

  // This function handles the book flights navbar loading
  $('body').on('click', '#book-flight', function(){
    let body = $('section#TripSelect');
    body.empty();
    body.load('project.html #TripSelect');
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
      // Currently 10 items, goes off the page - maybe 5?
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
    let input = $(this);
    $(window).on('click', function(e) {
      if ($(e.target).attr('class') != "item") {
        try{
          let strings = items[0].split(":");
          input.val(strings[0].toUpperCase() + " " + strings[1]);
        } catch(err) {
          input.val("");
        }
      input.parent().find('.autocomplete-list').css('display', 'none');
      input.parent().find('.autocomplete-list').empty();
      // input.val(items[0]);
    }
    $(window).off('click');
    });
  });

  $('body').on('click', '.item', function() {
    $(this).parent().parent().find('.autocomplete-list').css('display', 'none');
    let string = $(this).html();
    $(this).parent().parent().find(':input').val(string);
    $(this).parent().empty();
  });

});

function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getTime(date) {
  let split = date.split(/[-.TZ:]+/);
  // console.log(split);
  let hours = Number(split[3]);
  let minutes = split[4];
  let tod = "";
  if (hours < 12) {
    tod = "AM";
    if (hours==0){
      hours+=12;
    }
  } else {
    tod = "PM";
    if (hours > 12) {
      hours -= 12;
    }
  }
  let time = hours + ":" + minutes + " " +tod;
  return time;
}

function timeOfFlight(date1, date2) {
  let split1 = date1.split(/[-.TZ:]+/);
  let split2 = date2.split(/[-.TZ:]+/);
  let hours1 = Number(split1[3]);
  let minutes1 = Number(split1[4]);
  let total1 = 60*hours1 + minutes1;
  let hours2 = Number(split2[3]);
  let minutes2 = Number(split2[4]);
  let total2 = 60*hours2 + minutes2;
  let total = 0;
  // console.log(split1 + ", " + minutes1 + ", " + hours1 + ", " + total1);
  // console.log(split2 + ", " + minutes2 + ", " + hours2 + ", " + total2);
  if (total2 >= total1) {
    // console.log(total2 + " > " + total1);
    total = total2 - total1;
  } else {
    total = 24*60 - total1 + total2;

  }
  let hours = Math.floor(total / 60);
  let minutes = total % 60;
  // console.log(hours + "h, " + minutes + "m");
  return hours + "h, " + minutes + "m";
}

function yourFlights() {
  let body = $('section#TripSelect');
  body.empty();
  //now append the stuff for the Your Flights page.
  let toAppend = '<h2>Your Flights</h2>'+
                    '<div id="YourFlights"></div>';
  let div = $('<span id="no-flights">No flights booked yet!</span>');
  div.css("display", "none");
  body.append(toAppend);
  $('#YourFlights').append(div);
  $('.current-item').removeClass("current-item");
  $('#your-flights').addClass("current-item");

  $.ajax({
    url: root_url + 'flights?filter[info]='+ "booked",
    type: 'GET',
    async: false,
    xhrFields: {withCredentials: true},
    success: (flights) => {
      // console.log(flights)
      if (flights.length == 0) {
        div.css("display", "block");
      } else {
        div.css("display", "none");
      for(let flight of flights){
        // console.log(flight.id);
        $.ajax({
          url: root_url + 'seats?filter[info]='+ flight.id,
          type: 'GET',
          async: false,
          xhrFields: {withCredentials: true},
          success: (seats) => {
            // console.log(seats)
            for(let seat of seats){
              let been_booked = $('<div class="been_booked"></div>');
              $.ajax({
                url: root_url + 'airports/'+ flight.departure_id,
                type: 'GET',
                xhrFields: {withCredentials: true},
                async: false,
                success: (departure) => {
                  been_booked.append('<div class="airports">'+ departure.code + '</div>');
                }
              });
              $.ajax({
                url: root_url + 'airports/'+ flight.arrival_id,
                type: 'GET',
                xhrFields: {withCredentials: true},
                async: false,
                success: (arrival) => {
                  been_booked.find('.airports').html(been_booked.find('.airports').html() + " - " + arrival.code);
                }
              });
              $.ajax({
                url: root_url + 'airlines/'+ flight.airline_id,
                type: 'GET',
                xhrFields: {withCredentials: true},
                async: false,
                success: (airline) => {
                  been_booked.append('<div>'+ airline.name + '</div>');
                }
              });
              been_booked.append('<div>'+ getTime(flight.departs_at) + ' - ' + getTime(flight.arrives_at) + '</div>');
              been_booked.append('<div>Cabin: '+seat.cabin+' Row: '+seat.row+' Number: '+seat.number+'</div>');
              body.append(been_booked);
            }
           }
        });
      }
    }
  }
  });
}
