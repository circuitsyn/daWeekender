$(document).ready(function () {


    //Background Image JS

    var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'];
    $('#background').css({ 'background-image': 'url(assets/images/' + images[Math.floor(Math.random() * images.length)] + ')' });

});


//End of Background Image JS

// start of google map and geocode api calls and functions
// grab our search button ID
var submitForm = $('#search-button');
// create on click function to run when we click submit
submitForm.on("click", function (event) {
    // Prevent page reload on submit
    event.preventDefault();
    // location varible
    var location = $("#search-input").val();

    var queryUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyBoDweaPm-2OM397JbMV3n1L-WqHM6ABOM"
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        // log full response
        console.log(response);
        // pull lat and lng
        var lat = response.results[0].geometry.location.lat
        var lng = response.results[0].geometry.location.lng
        // log our lat and lng to the console
        console.log(lat);
        console.log(lng);
        // pull formal formated address
        var dest = response.results[0].formatted_address
        // log our formal address
        console.log(dest);
        // push formated_address to #mainline div
        $('#mainLine').text(dest);
        // create a map variable
        var map;
        // function to create our map
        function initMap() {
            // appending our #map div to our map variable 
            map = new google.maps.Map(document.getElementById('map'), {
                // choose our location
                center: { lat: lat, lng: lng },
                // choose our zoom
                zoom: 8
            });
            // create marker variable 
            var marker = new google.maps.Marker({
                // grab lat and lng for our positioning, same as our center
                position: { lat: lat, lng: lng },
                // put it on the same map
                map: map,
            })
        }
        // call initMap funciton
        initMap();
        //  $('#map').html(map);

        // end of google map and geocode api calls and functions

        //=========================================================================

        // Start of Events API - Meetup.com
        var meetupAPI = '1e26b5231546533317352a49132a2';

        $.ajax({
            url: 'https://api.meetup.com/2/open_events?key=' + meetupAPI + '&sign=true&photo-host=public&lat=' + lat + '&lon=' + lng + '&page=9',
            dataType: 'jsonp',
            // Function to call on success
            success: function (data) {
                console.log(data);

                console.log(data.results[0].description);
                $('#eventCard').empty();
                $('#eventCard').append('<h5 class="card-title">Events</h5>');

                for (i = 0; i < data.results.length; i++) {
                    var link = data.results[i].event_url;
                    var text = data.results[i].name;
                    $('#eventCard').append('<div><a href="' + link + '"> ' + (i + 1) + '. ' + text + '</a></div>');
                }

            }
        });
        // End of Events API - Meetup.com
        //==========================================================================

        //start of Weather API -- darksky.net
        var today = moment();
        console.log(today["_d"].toString().substring(0, 3));

        var dayOfWeek = today["_d"].toString().substring(0, 3);

        if (dayOfWeek == "Sat" || dayOfWeek == "Sun") {
            var friRequestDay = moment().add(3, "days").day("Friday");  //.unix();
            console.log(friRequestDay.unix());
            var satRequestDay = moment().add(3, "days").day("Saturday");  //.unix();
            console.log(satRequestDay.unix());
            var sunRequestDay = moment().add(3, "days").day("Sunday");  //.unix();
            console.log(sunRequestDay.unix());
        }
        else {
            var friRequestDay = moment().day("Friday");
            console.log(friRequestDay.unix());
            var satRequestDay = moment().day("Saturday");
            console.log(satRequestDay.unix());
            var sunRequestDay = moment().add(1, "week").day("Sunday");
            console.log(sunRequestDay.unix());
        }

        //grab the weekend forecast info for each day  -----> display date as well
        var weekendForecast = {
            friday: {
                icon: "",
                temperatureHigh: 0,
                temperatureLow: 0
            },
            saturday: {
                icon: "",
                temperatureHigh: 0,
                temperatureLow: 0
            },
            sunday: {
                icon: "",
                temperatureHigh: 0,
                temperatureLow: 0
            }
        }

            //creating AJAX call for when search is executed  -----> 
            $.ajax({
                url: "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/79f28cba6a99105fef42cde285bc6226/" + lat + "," + lng + "," + friRequestDay.unix(),
                method: "GET"
            }).done(function (data) {

                var dailyResponse = data.daily.data;
                console.log(dailyResponse);

                //push daily response data into the weekend forecast object
                    weekendForecast.friday.icon = data.daily.data[0].icon;
                    weekendForecast.friday.temperatureHigh = data.daily.data[0].temperatureHigh;
                    weekendForecast.friday.temperatureLow = data.daily.data[0].temperatureLow;
                    console.log(weekendForecast.friday.icon);
                    console.log(weekendForecast.friday.temperatureHigh);
                    console.log(weekendForecast.friday.temperatureLow);

                    $.ajax({
                        url: "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/79f28cba6a99105fef42cde285bc6226/" + lat + "," + lng + "," + satRequestDay.unix(),
                        method: "GET"
                    }).done(function (data) {
        
                        var dailyResponse = data.daily.data;
                        console.log(dailyResponse);
        
                        //push daily response data into the weekend forecast object
                            weekendForecast.saturday.icon = data.daily.data[0].icon;
                            weekendForecast.saturday.temperatureHigh = data.daily.data[0].temperatureHigh;
                            weekendForecast.saturday.temperatureLow = data.daily.data[0].temperatureLow;
                            console.log(weekendForecast.saturday.icon);
                            console.log(weekendForecast.saturday.temperatureHigh);
                            console.log(weekendForecast.saturday.temperatureLow);
        
                            $.ajax({
                                url: "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/79f28cba6a99105fef42cde285bc6226/" + lat + "," + lng + "," + sunRequestDay.unix(),
                                method: "GET"
                            }).done(function (data) {
                
                                var dailyResponse = data.daily.data;
                                console.log(dailyResponse);
                
                                //push daily response data into the weekend forecast object
                                    weekendForecast.sunday.icon = data.daily.data[0].icon;
                                    weekendForecast.sunday.temperatureHigh = data.daily.data[0].temperatureHigh;
                                    weekendForecast.sunday.temperatureLow = data.daily.data[0].temperatureLow;
                                    console.log(weekendForecast.sunday.icon);
                                    console.log(weekendForecast.sunday.temperatureHigh);
                                    console.log(weekendForecast.sunday.temperatureLow);
                
                                    console.log(weekendForecast);

                                    //variables for pushing forecast data to HTML
                                    var friHighTemp = weekendForecast.friday.temperatureHigh;
                                    var friLowTemp = weekendForecast.friday.temperatureLow;
                                    var friIcon = weekendForecast.friday.icon;
                                    var satHighTemp = weekendForecast.saturday.temperatureHigh;
                                    var satLowTemp = weekendForecast.saturday.temperatureLow;
                                    var satIcon= weekendForecast.saturday.icon;
                                    var sunHighTemp = weekendForecast.sunday.temperatureHigh;
                                    var sunLowTemp = weekendForecast.sunday.temperatureLow;
                                    var sunIcon = weekendForecast.sunday.icon;
                                
                                    //append weather data to page using jquery
                                    $(".forecast").append(
                                        '<p class="friHighTemp">' + friHighTemp + "&#8457;" + '</p>' +
                                        '<p class="friLowTemp">' + friLowTemp + "&#8457;" + '</p>' +
                                        '<p class="friPrecip">' + friIcon + '</p>' +
                                        '<p class="satHighTemp">' + satHighTemp + "&#8457;" + '</p>' +
                                        '<p class="satLowTemp">' + satLowTemp + "&#8457;" + '</p>' +
                                        '<p class="satPrecip">' + satIcon + '</p>' +
                                        '<p class="sunHighTemp">' + sunHighTemp + "&#8457;" + '</p>' +
                                        '<p class="sunLowTemp">' + sunLowTemp + "&#8457;" + '</p>' +
                                        '<p class="sunPrecip">' + sunIcon + '</p>'
                                    );
                                    
                                    //add skycons to weather data
                                    var skycons = new Skycons({"color": "blue"});
                                    skycons.add(document.getElementById("friSkyCon"), weekendForecast.friday.icon);
                                    skycons.add(document.getElementById("satSkyCon"), weekendForecast.saturday.icon);
                                    skycons.add(document.getElementById("sunSkyCon"), weekendForecast.sunday.icon);

                                    skycons.play();
  
                                // end of Weather API -- darksky.net
                                //=======================================================================
                            });
                    
                        // end of Weather API -- darksky.net
                        //=======================================================================
                    });
                
            
                // end of Weather API -- darksky.net
                //=======================================================================
            });

    });

});




