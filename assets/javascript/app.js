$(document).ready(function () {
    //===================================================================
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB5aFtlCItfykUqZf2FrKHOJMTLuXV6JQQ",
        authDomain: "theweekender-6c8c4.firebaseapp.com",
        databaseURL: "https://theweekender-6c8c4.firebaseio.com",
        projectId: "theweekender-6c8c4",
        storageBucket: "theweekender-6c8c4.appspot.com",
        messagingSenderId: "830340126520"
    };

    //initializing firebase config
    firebase.initializeApp(config);

    //Bring firebase down to connect for manipulation
    var database = firebase.database();

    //receive data from firebase and store in variables - limit to 5 recent searches
    database.ref('/searches').limitToLast(5).on("child_added", function (snapshot) {

        searchTerm = snapshot.val().searchTermServ;

        //Append data to results card
        $('#recentSearchesArea').append('<button id="search-button" type="button" class="btn btn-success resultButton">' + searchTerm + '</button><br>')

    });
    //End of Firebase Main
    //====================================================================

    //Background Image JS

    var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'];
    $('#background').css({ 'background-image': 'url(assets/images/' + images[Math.floor(Math.random() * images.length)] + ')' });



    //End of Background Image JS
    //======================================================================

    // start of google map and geocode api calls and functions
    // grab our search button ID
    var submitForm = $('#search-button');
    // create on click function to run when we click submit
    submitForm.on("click", function (event) {
        // Prevent page reload on submit
        event.preventDefault();

        // -------firebase component insert------- 
        // store value of search term in firebase variable
        searchTerm = $("#search-input").val()
        // push value to firebase
        database.ref('/searches').push({
            searchTermServ: searchTerm,
        });
        // --------------------------------------


        // location varible
        var location = $("#search-input").val();

        var queryUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyBoDweaPm-2OM397JbMV3n1L-WqHM6ABOM"
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            // log full response
            console.log("Location API Data:");
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

            // adding direction link to map card ====================================
            // variable to create the directions map dynamically 
            var dirLink = "https://www.google.com/maps/dir/?api=1&parameters&destination=" + lat + "," + lng;
            // var to open map in a new tab
            var newTab = "_blank";
            // console log our link with searched lat and lng
            console.log(dirLink);
            // put our attributes to the map-direction anchor
            $('#map-direction').attr("href", dirLink).attr("target", newTab);
            // end of adding direction link to map card =============================

            // end of google map and geocode api calls and functions

            //=========================================================================

            // Start of Events API - Meetup.com
            var meetupAPI = '1e26b5231546533317352a49132a2';

            $.ajax({
                url: 'https://api.meetup.com/2/open_events?key=' + meetupAPI + '&sign=true&photo-host=public&lat=' + lat + '&lon=' + lng + '&page=9',
                dataType: 'jsonp',
                // Function to call on success
                success: function (data) {
                    console.log("Events API Data:");
                    console.log(data);

                    // $('#resultArea').empty();
                    // $('#resultArea').append('<h5 class="card-title">Events</h5>');
                    $('#eventResultArea').empty();
                    for (i = 0; i < data.results.length; i++) {
                        var link = data.results[i].event_url;
                        var text = data.results[i].name;

                        //apppend event api events to card

                        $('#eventResultArea').append('<div id="resultEntry" class="row container"><div class="resultWrapper"><img class="resultIcon float-left p-1 img-responsive" src="assets/images/eventIcon.png" alt="result icon"><a class="linkMod" href="' + link + '"' + ' target="_blank">' + text + '</a></div></div>');
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
                        var satIcon = weekendForecast.saturday.icon;
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
                        var skycons = new Skycons({ "color": "blue" });
                        skycons.add(document.getElementById("friSkyCon"), weekendForecast.friday.icon);
                        skycons.add(document.getElementById("satSkyCon"), weekendForecast.saturday.icon);
                        skycons.add(document.getElementById("sunSkyCon"), weekendForecast.sunday.icon);

                        skycons.play();

                    });
                });
            });//end of darksky api call

            // end of Weather API -- darksky.net
            //=======================================================================

            // Start of Hiking API ====================

            var maxDistance = 30;
            var queryURL_Hiking = 'https://www.hikingproject.com/data/get-trails?lat=' + lat + '&lon=' + lng + '&maxDistance=' + maxDistance + '&key=200364142-c73ec0ae2d02db6031cef492b6b86f45'
            $.ajax({
                url: queryURL_Hiking,
                method: "GET"
            }).then(function (responseHikingInfo) {

                //console.log(queryURL_Hiking);
                console.log("Hiking API Data:");
                console.log(responseHikingInfo);
                var numberOfTrails = responseHikingInfo.trails.length;
                
                $('#hikingResultsArea').empty();
                //console.log ('number of trails available within max distance: '+numberOfTrails)
                for (var i = 0; i < numberOfTrails; i++) {
                    var locationURL = responseHikingInfo.trails[i].url;
                    var locationName = responseHikingInfo.trails[i].name;
                    locationName = locationName.substring(0,28) + '..';
                    // $('#hikingCard').append('<div><a href="' + locationURL + '"> '+ (i+1) + '. ' + locationName + '</a></div>');
                    
                    // $('#hikingResultsArea').append('<div id="resultEntry" class="row container"><div class="resultWrapper"><img class="resultIcon float-left p-1 img-responsive" src="assets/images/tree.png" alt="result icon"><a class="linkMod" href="' + locationURL + '"' + ' target="_blank">' + locationName + '</a></div></div>');
                    
                    //Building divs and appending
                    var hikingDiv = $('<div>');
                    $(hikingDiv).attr('id','resultHikingContainer');
                    $(hikingDiv).addClass("row container resultWrapper");
                    $('#hikingResultsArea').append(hikingDiv);

                    //Building Image and appending
                    var hikingIcon = $('<img>');
                    $(hikingIcon).addClass("resultIcon float p-1 img-responsive");
                    $(hikingIcon).attr('src', 'assets/images/tree.png');
                    $(hikingIcon).attr('alt', 'result icon');
                    $('#resultHikingContainer').append(hikingIcon);
                    
                    //Building Button and appending
                    var hikingButton = $('<button>');
                    $(hikingButton).addClass("btn btn-success narrower hikingButtonModalLink");
                    $(hikingButton).attr('type','button');
                    $(hikingButton).attr('data-toggle','modal');
                    $(hikingButton).attr('data-info', JSON.stringify(responseHikingInfo.trails[i]));
                    $(hikingButton).attr('iteration', i);
                    $(hikingButton).attr('data-target','.hikingModal');
                    $(hikingButton).text(locationName);
                    $('#resultHikingContainer').append(hikingButton);
                }
                //Modal on click function
                $('.hikingButtonModalLink').on("click", function (event) {
                    var hikingObject = JSON.parse($(this).attr('data-info'));
                    var x = $(this).attr('iteration');
                    console.log('value of x: ' + x);
                    // console.log(JSON.parse(hikingObject));
                    
                    //Append Image
                    image = $('<img>');
                    $(image).attr('src', hikingObject.imgMedium);
                    $(image).attr('alt','Hiking Location Featured Image');
                    $('.modalImage').empty();
                    $('.modalImage').append(image);
                    
                    //Append Title
                    a = $('<a>');
                    $(a).attr('href', hikingObject.url);
                    $(a).text(hikingObject.name);
                    $(a).attr('target', '_blank');
                    $('.modalTitle').empty();
                    $('.modalTitle').append(a);

                    //Append Location
                    location = $('<h4>');
                    $(location).text(hikingObject.location);
                    $('.modalLocation').empty();
                    $('.modalLocation').append(location);

                    //Append Stats
                    //Rating
                    rating = $('<h3>');
                    $(rating).text('Rating (1-5): ' + hikingObject.rating);
                    $('#modalRating').empty();
                    $('#modalRating').append(rating);

                    //Difficulty
                    difficulty = $('<h3>');
                    $(difficulty).text('Difficulty: ' + hikingObject.difficulty);
                    $('#modalDifficulty').empty();
                    $('#modalDifficulty').append(difficulty);

                    //Length
                    length = $('<h3>');
                    $(length).text('Distance (miles): ' + hikingObject.length);
                    $('#modalLength').empty();
                    $('#modalLength').append(length);


                    //Append Summary
                    //Summary title
                    summaryHeader = $('<h3>');
                    $(summaryHeader).text('Summary: ');
                    $('.modalSummary').empty();
                    $('.modalSummary').append(summaryHeader);

                    //Summary text
                    summaryText = $('<p>');
                    $(summaryText).text(hikingObject.summary);
                    $('.modalSummary').append(summaryText);

                    });
            });

            // End of Hiking API ====================


            // Start of Restaurant API ====================
            var queryURL_Restaurant = 'https://developers.zomato.com/api/v2.1/search?count=15&lat=' + lat + '&lon=' + lng + '&radius=3000';

            $.ajax({
                url: queryURL_Restaurant,
                method: "GET",
                "headers": {
                    "user-key": "484b921e03f7cc2c9335696b2d2ff5e3",
                    "accept": "application/json"
                }
            }).then(function (responseRestaurantInfo) {
                //console.log(queryURL_Restaurant);
                console.log("Retaurant API Data:");
                console.log(responseRestaurantInfo);
                var numberOfRestaurants = responseRestaurantInfo.restaurants.length;
                //console.log ('number of restaurant available within max distance: '+numberOfRestaurants);

                // $('#restaurantCard').empty();
                // $('#restaurantCard').append('<h5 class="card-title">Restaurants</h5>');
                $('#restaurantResultsArea').empty();
                for (var i = 0; i < numberOfRestaurants; i++) {
                    var restaurantURL = responseRestaurantInfo.restaurants[i].restaurant.url;
                    var restaurantName = responseRestaurantInfo.restaurants[i].restaurant.name;
                    // $('#restaurantCard').append('<div><a href="' + restaurantURL + '"> '+ (i+1) + '. ' + restaurantName + '</a></div>');

                    $('#restaurantResultsArea').append('<div id="resultEntry" class="row container"><div class="resultWrapper"><img class="resultIcon float-left p-1 img-responsive" src="assets/images/hamburger.png" alt="result icon"><a class="linkMod" href="' + restaurantURL + '"' + ' target="_blank">' + restaurantName + '</a></div></div>');


                }
            });
            // End of Restaurant API ====================

        });//end of google submit function

    });

    

})




