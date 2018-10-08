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
    
    // //========Firebase Sign in and Sign Out Code==========
    // var provider = new firebase.auth.GoogleAuthProvider();

    // function googleSignin() {
    // firebase.auth()
    
    // .signInWithPopup(provider).then(function(result) {
    //     var token = result.credential.accessToken;
    //     var user = result.user;
            
    //     console.log(token)
    //     console.log(user)
    // }).catch(function(error) {
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
            
    //     console.log(error.code)
    //     console.log(error.message)
    // });
    // }

    // function googleSignout() {
    // firebase.auth().signOut()
        
    // .then(function() {
    //     console.log('Signout Succesfull')
    // }, function(error) {
    //     console.log('Signout Failed')  
    // });
    // }

    // //========End of login/logout code==============
    // ===========GLOBAL VARIABLES===============
    var lat = 0;
    var lng = 0;
    var hikingResults;
    var currentRestaurantCount = 0;
    var currentTrailCount = 0;

    //Bring firebase down to connect for manipulation
    var database = firebase.database();

    database.ref('/searches').limitToLast(1).on("child_added", function(snapshot) {
        recentSearch = snapshot.val().searchTermServ

        //receive data from firebase and store in variables - limit to 5 recent searches
        database.ref('/searches').limitToLast(5).on("child_added", function (snapshot) {

            searchTerm = snapshot.val().searchTermServ;
            //Append data to results card
            $('#recentSearchesArea').append('<button id="search-button" type="button" class="btn btn-success resultButton">' + searchTerm + '</button><br>');
        });
        //=====================================================================
        //Background Image JS

        var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'];
        $('#background').css({ 'background-image': 'url(assets/images/' + images[Math.floor(Math.random() * images.length)] + ')' });

        //End of Background Image JS
        //======================================================================

        // start of google map and geocode api calls and functions
        function results() {

            var queryUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + recentSearch + "&key=AIzaSyBoDweaPm-2OM397JbMV3n1L-WqHM6ABOM"
            $.ajax({
                url: queryUrl,
                method: "GET"
            }).done(function (response) {
                // log full response
                console.log("Location API Data:");
                console.log(response);
                // pull lat and lng
                lat = response.results[0].geometry.location.lat
                lng = response.results[0].geometry.location.lng
                // log our lat and lng to the console
                console.log(lat);
                console.log(lng);
                // pull formal formated address
                var dest = response.results[0].formatted_address
                // log our formal address
                console.log(dest);
                // push formated_address to #mainline div
                $('#main').text(dest);
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
                        temperatureLow: 0,
                        time: 0
                    },
                    saturday: {
                        icon: "",
                        temperatureHigh: 0,
                        temperatureLow: 0,
                        time: 0
                    },
                    sunday: {
                        icon: "",
                        temperatureHigh: 0,
                        temperatureLow: 0,
                        time: 0
                    }
                }
    
                //creating AJAX call for when search is executed  -----> 
                //AJAX call for Friday
                $.ajax({
                    url: "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/79f28cba6a99105fef42cde285bc6226/" + lat + "," + lng + "," + friRequestDay.unix(),
                    method: "GET"
                }).done(function (data) {
    
                    var dailyResponse = data.daily.data;
                    console.log(dailyResponse);
    
                    //push daily response data into the weekend forecast object
                    weekendForecast.friday.time = data.daily.data[0].time;
                    weekendForecast.friday.icon = data.daily.data[0].icon;
                    weekendForecast.friday.temperatureHigh = data.daily.data[0].temperatureHigh;
                    weekendForecast.friday.temperatureLow = data.daily.data[0].temperatureLow;
                    console.log(weekendForecast.friday.time);
                    console.log(weekendForecast.friday.icon);
                    console.log(weekendForecast.friday.temperatureHigh);
                    console.log(weekendForecast.friday.temperatureLow);
    
                    //AJAX call for Saturday
                    $.ajax({
                        url: "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/79f28cba6a99105fef42cde285bc6226/" + lat + "," + lng + "," + satRequestDay.unix(),
                        method: "GET"
                    }).done(function (data) {
    
                        var dailyResponse = data.daily.data;
                        console.log(dailyResponse);
    
                        //push daily response data into the weekend forecast object
                        weekendForecast.saturday.time = data.daily.data[0].time;
                        weekendForecast.saturday.icon = data.daily.data[0].icon;
                        weekendForecast.saturday.temperatureHigh = data.daily.data[0].temperatureHigh;
                        weekendForecast.saturday.temperatureLow = data.daily.data[0].temperatureLow;
                        console.log(weekendForecast.saturday.time);
                        console.log(weekendForecast.saturday.icon);
                        console.log(weekendForecast.saturday.temperatureHigh);
                        console.log(weekendForecast.saturday.temperatureLow);
    
                        //AJAX call for Sunday
                        $.ajax({
                            url: "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/79f28cba6a99105fef42cde285bc6226/" + lat + "," + lng + "," + sunRequestDay.unix(),
                            method: "GET"
                        }).done(function (data) {
    
                            var dailyResponse = data.daily.data;
                            console.log(dailyResponse);
    
                            //push daily response data into the weekend forecast object
                            weekendForecast.sunday.time = data.daily.data[0].time;
                            weekendForecast.sunday.icon = data.daily.data[0].icon;
                            weekendForecast.sunday.temperatureHigh = data.daily.data[0].temperatureHigh;
                            weekendForecast.sunday.temperatureLow = data.daily.data[0].temperatureLow;
                            console.log(weekendForecast.sunday.time);
                            console.log(weekendForecast.sunday.icon);
                            console.log(weekendForecast.sunday.temperatureHigh);
                            console.log(weekendForecast.sunday.temperatureLow);
    
                            console.log(weekendForecast);
    
                            //variables for pushing forecast data to HTML
                            var friHighTemp = weekendForecast.friday.temperatureHigh;
                            var friLowTemp = weekendForecast.friday.temperatureLow;
                            var satHighTemp = weekendForecast.saturday.temperatureHigh;
                            var satLowTemp = weekendForecast.saturday.temperatureLow;
                            var sunHighTemp = weekendForecast.sunday.temperatureHigh;
                            var sunLowTemp = weekendForecast.sunday.temperatureLow;
    
                            //convert temp data to whole numbers
                            friHighTemp = Math.round(friHighTemp);
                            friLowTemp = Math.round(friLowTemp);
                            satHighTemp = Math.round(satHighTemp);
                            satLowTemp = Math.round(satLowTemp);
                            sunHighTemp = Math.round(sunHighTemp);
                            sunLowTemp = Math.round(sunLowTemp);
    
                            //convert time to calendar date using moment.js
                            friDate = friRequestDay.format("ll");
                            console.log(friDate);
                            satDate = satRequestDay.format("ll");
                            console.log(satDate);
                            sunDate = sunRequestDay.format("ll");
                            console.log(sunDate);
      
                            //append weather data to page using jquery
                            $("#friWeather").html(
                                '<p class="friDate">' + friDate + '</p>' +
                                '<p class="friHighTemp">' + "High  " + friHighTemp + "&#8457;" + '</p>' +
                                '<p class="friLowTemp">' + "Low  " + friLowTemp + "&#8457;" + '</p>'
                            );
                            $("#satWeather").html(
                                '<p class="satDate">' + satDate + '</p>' +
                                '<p class="satHighTemp">' + "High  " + satHighTemp + "&#8457;" + '</p>' +
                                '<p class="satLowTemp">' + "Low  " + satLowTemp + "&#8457;" + '</p>'   
                            );
                            $("#sunWeather").html(
                                '<p class="sunDate">' + sunDate + '</p>' +
                                '<p class="sunHighTemp">' + "High  "  + sunHighTemp + "&#8457;" + '</p>' +
                                '<p class="sunLowTemp">' + "Low  " + sunLowTemp + "&#8457;" + '</p>' 
                            );
    
                            //add skycons to weather data
                            var skycons = new Skycons({ "color": "#4d94ff" });
                            skycons.add(document.getElementById("friSkyCon"), weekendForecast.friday.icon);
                            skycons.add(document.getElementById("satSkyCon"), weekendForecast.saturday.icon);
                            skycons.add(document.getElementById("sunSkyCon"), weekendForecast.sunday.icon);
    
                            skycons.play();

                        });
                    });
                });//end of darksky api call

                // end of Weather API -- darksky.net
                //=======================================================================

                // Start of Events API - Meetup.com ====================
                meetupAPICalls();
                // End of Events API - Meetup.com ====================

                // Start of Hiking API - Hiking Project ====================
                hikingAPICalls();
                // End of Hiking API - Hiking Project ====================

                // Start of Restaurant API - Zomato ====================
                restaurantAPICalls();
                // End of Restaurant API -Zomato ====================

            });//end of google submit function

        };
        // run results function
        results();
        //====================================================================
        // create variable for search button input
        var inputForm = $('#add-topic');
        // on click funciton triggered when add-topic button is clicked
        inputForm.on("click", function(event) {

            if($("#topic-input").val() == '')
{
    event.preventDefault();
} else
        // make recentSearch qual to topic-input
            recentSearch = $("#topic-input").val()
            // push value to firebase
            database.ref('/searches').push({
                    searchTermServ: recentSearch,
            });
        //End of Firebase Main
        })
    }); 
    
    // ============== EVENTS: MEETUP ============== 
    // Start of MeetUp Functions and Event Listeners (Next and Prev buttons) ====================
    var currentEventCount = 0;
    var meetupAPI = '1e26b5231546533317352a49132a2';
    var numberOfPages = 100;
    var meetupAPICalls = function() {
        $.ajax({
            url: 'https://api.meetup.com/2/open_events?key=' + meetupAPI + '&sign=true&photo-host=public&lat=' + lat + '&lon=' + lng + '&page=' + numberOfPages,
            dataType: 'jsonp',
            // Function to call on success
            success: function (data) {
                console.log("Events API Data:");
                console.log(data);
                meetUpResults = data.results;
                newMeetUpEvents(meetUpResults);
            }  
        })  
    }

    var newMeetUpEvents = function(eventData) {
        
    
            $('#eventResultArea').empty();
            for (i = currentEventCount; i < currentEventCount + 5; i++) {
                //var link = data.results[i].event_url;
                var text = eventData[i].name;
                text = text.substring(0,20) + '..';

            //Building divs and appending
            
            var eventsDiv = $('<div>');
            $(eventsDiv).attr('class','resultEventsContainer');
            $(eventsDiv).addClass("row container resultWrapper");
            
            //Building Image and appending
            var eventsIcon = $('<img>');
            $(eventsIcon).addClass("resultIcon float-left p-1 img-responsive");
            $(eventsIcon).attr('src', 'assets/images/eventIcon.png');
            $(eventsIcon).attr('alt', 'result icon');
            $(eventsDiv).append(eventsIcon);
            
            //Building Button and appending
            var eventsButton = $('<button>');
            $(eventsButton).addClass("btn btn-success narrower eventsButtonModalLink");
            $(eventsButton).attr('type','button');
            $(eventsButton).attr('data-toggle','modal');
            $(eventsButton).attr('data-info', JSON.stringify(eventData[i]));
            $(eventsButton).attr('data-target','.hikingModal');
            $(eventsButton).text(text);
            $(eventsDiv).append(eventsButton);
            //Append the div with contents to results area
            $('#eventResultArea').append(eventsDiv);
            }

            //Modal on click function
            //This is the listener applied to the events modal button - sits outside and independent of the for loop for button creation above, but still inside the respective api call
            $('.eventsButtonModalLink').on("click", function (event) {
                var eventsObject = JSON.parse($(this).attr('data-info'));
                                                
                //Append Image
                var image = $('<img>');
                $(image).attr('src', eventsObject.photo_url);
                $(image).attr('alt','Meetup Featured Image');
                $('.modalImage').empty();
                $('.modalImage').append(image);
                
                //Append Title
                var a = $('<a>');
                $(a).attr('href', eventsObject.event_url);
                $(a).text(eventsObject.name);
                $(a).attr('target', '_blank');
                $('.modalTitle').empty();
                $('.modalTitle').append(a);

                //Append Location
                var location = $('<h4>');
                $(location).text(eventsObject.venue.name + ': ' + eventsObject.venue.address_1 + ' ' + eventsObject.venue.city);
                $('.modalLocation').empty();
                $('.modalLocation').append(location);

                //Append Stats
                //RSVP
                var rating = $('<h3>');
                $(rating).text('RSVP Count: ' + eventsObject.yes_rsvp_count);
                $('#modalRating').empty();
                $('#modalRating').append(rating);

                //Waitlist
                var difficulty = $('<h3>');
                $(difficulty).text('Waitlist Count: ' + eventsObject.waitlist_count);
                $('#modalDifficulty').empty();
                $('#modalDifficulty').append(difficulty);

                //Visibility
                var length = $('<h3>');
                $(length).text('Visibility: ' + eventsObject.visibility);
                $('#modalLength').empty();
                $('#modalLength').append(length);


                //Append Summary
                //Summary title
                var summaryHeader = $('<h3>');
                $(summaryHeader).text('Summary: ');
                $('.modalSummary').empty();
                $('.modalSummary').append(summaryHeader);

                //Summary text
                var summaryText = $('<div>');
                $(summaryText).text(eventsObject.description);
                $('.modalSummary').append(summaryText);

            });
    }

    $("#nextEvent").on("click", function(){
        if (currentEventCount < 95) {
            currentEventCount += 5;
            console.log('current Event count: ' + currentEventCount);
        } else {
            currentEventCount = 0;
            console.log('current Event count: ' + currentEventCount);
        }
        //currentEventCount += 5;
        newMeetUpEvents(meetUpResults);
    });

    $("#prevEvent").on("click", function(){
        if (currentEventCount <= 0) {
            currentEventCount = 95;
            console.log('current Event count: ' + currentEventCount);
        } else {
            currentEventCount -= 5;
            console.log('current Event count: ' + currentEventCount);
        }

        newMeetUpEvents(meetUpResults);
    });


    //End of MeetUp Functions and  Event Listener (Next and Prev buttons) ====================

    // ============== HIKING ============== 
    //Start of Hiking Functions and Event Listeners (Next and Prev buttons) ====================

    var hikingAPICalls = function() {
        var maxDistance = 100;
        var maxResults = 200;
        var queryURL_Hiking = 'https://www.hikingproject.com/data/get-trails?lat='+lat+'&lon='+lng+'&maxDistance='+maxDistance+'&maxResults='+maxResults+'&key=200364142-c73ec0ae2d02db6031cef492b6b86f45'
        $.ajax({
            url: queryURL_Hiking,
            method: "GET"
        }).then(function(responseHikingInfo) {
            hikingResults = responseHikingInfo.trails;
            // console.log(queryURL_Hiking);
            // console.log("Hiking API Data:");
            // console.log(responseHikingInfo);
            newHikingTrails(hikingResults);
        }); 
    }

        
    var newHikingTrails = function(data) {
        $('#hikingResultsArea').empty();
        //console.log ('number of trails available within max distance: '+numberOfTrails)
        for (var i = currentTrailCount; i < currentTrailCount + 5; i++) {
            //var locationURL = data[i].url;
            var locationName = data[i].name;
            locationName = locationName.substring(0,20) + '..';

            // $('#hikingCard').append('<div><a href="' + locationURL + '"> '+ (i+1) + '. ' + locationName + '</a></div>');
            //$('#hikingResultsArea').append('<div id="resultEntry" class="row container"><div class="resultWrapper"><img class="resultIcon float-left p-1 img-responsive" src="assets/images/tree.png" alt="result icon"><a class="linkMod" href="' + locationURL + '"' + ' target="_blank">' + locationName + '</a></div></div>');                        
            
            //Building divs and appending
            
            var hikingDiv = $('<div>');
            $(hikingDiv).attr('class','resultHikingContainer');
            $(hikingDiv).addClass("row container resultWrapper");
            
            //Building Image and appending
            var hikingIcon = $('<img>');
            $(hikingIcon).addClass("resultIcon float-left p-1 img-responsive");
            $(hikingIcon).attr('src', 'assets/images/tree.png');
            $(hikingIcon).attr('alt', 'result icon');
            $(hikingDiv).append(hikingIcon);
            
            //Building Button and appending
            var hikingButton = $('<button>');
            $(hikingButton).addClass("btn btn-success narrower hikingButtonModalLink");
            $(hikingButton).attr('type','button');
            $(hikingButton).attr('data-toggle','modal');
            $(hikingButton).attr('data-info', JSON.stringify(data[i]));
            $(hikingButton).attr('data-target','.hikingModal');
            $(hikingButton).text(locationName);
            $(hikingDiv).append(hikingButton);
            //Append the div with contents to results area
            $('#hikingResultsArea').append(hikingDiv);

        };

        //Modal on click function
        //This is the listener applied to the hiking modal button - sits outside and independent of the for loop for button creation above, but still inside the respective api call
        $('.hikingButtonModalLink').on("click", function (event) {
            var hikingObject = JSON.parse($(this).attr('data-info'));
                                                
            //Append Image
            var image = $('<img>');
            $(image).attr('src', hikingObject.imgMedium);
            $(image).attr('alt','Hiking Location Featured Image');
            $('.modalImage').empty();
            $('.modalImage').append(image);
            
            //Append Title
            var a = $('<a>');
            $(a).attr('href', hikingObject.url);
            $(a).text(hikingObject.name);
            $(a).attr('target', '_blank');
            $('.modalTitle').empty();
            $('.modalTitle').append(a);

            //Append Location
            var location = $('<h4>');
            $(location).text(hikingObject.location);
            $('.modalLocation').empty();
            $('.modalLocation').append(location);

            //Append Stats
            //Rating
            var rating = $('<h3>');
            $(rating).text('Rating (1-5): ' + hikingObject.stars);
            $('#modalRating').empty();
            $('#modalRating').append(rating);

            //Difficulty
            var difficulty = $('<h3>');
            $(difficulty).text('Difficulty: ' + hikingObject.difficulty);
            $('#modalDifficulty').empty();
            $('#modalDifficulty').append(difficulty);

            //Length
            var length = $('<h3>');
            $(length).text('Distance (miles): ' + hikingObject.length);
            $('#modalLength').empty();
            $('#modalLength').append(length);


            //Append Summary
            //Summary title
            var summaryHeader = $('<h3>');
            $(summaryHeader).text('Summary: ');
            $('.modalSummary').empty();
            $('.modalSummary').append(summaryHeader);

            //Summary text
            var summaryText = $('<p>');
            $(summaryText).text(hikingObject.summary);
            $('.modalSummary').append(summaryText);
        });
    }

    $("#nextTrail").on("click", function(){
        if (currentTrailCount < 195) {
            currentTrailCount += 5;
            console.log('current Trail count: ' + currentTrailCount);
        } else {
            currentTrailCount = 0;
            console.log('current Trail count: ' + currentTrailCount);
        }
        //currentTrailCount += 5;
        newHikingTrails(hikingResults);
    });

    $("#prevTrail").on("click", function(){
        if (currentTrailCount <= 0) {
            currentTrailCount = 195;
            console.log('current Trail count: ' + currentTrailCount);
        } else {
            currentTrailCount -= 5;
            console.log('current Trail count: ' + currentTrailCount);
        }

        newHikingTrails(hikingResults);
    });
    
    //End of Hiking Functions and Event Listeners (Next and Prev buttons) ====================

    // ============== RESTAURANT ============== 
    //Start of Restaurant Functions and Event Listeners (Next and Prev buttons) ====================

    var newRestaurants = function(data){ 
        $('#restaurantResultsArea').empty();
        
        for (var i = 0; i < 5; i++){
            console.log('rendering resturants')
            // var restaurantURL = data[i].restaurant.url;
            var restaurantName = data[i].restaurant.name;
            restaurantName = restaurantName.substring(0,20) + '..';
            //$('#restaurantCard').append('<div><a href="' + restaurantURL + '"> '+ (i+1) + '. ' + restaurantName + '</a></div>');
            // $('#restaurantResultsArea').append('<div id="resultEntry" class="row container"><div class="resultWrapper"><img class="resultIcon float-left p-1 img-responsive" src="assets/images/hamburger.png" alt="result icon"><a class="linkMod" href="' + restaurantURL + '"' + ' target="_blank">' + restaurantName + '</a></div></div>');

            // //Building divs and appending
            
            var restaurantDiv = $('<div>');
            restaurantDiv.attr('class','resultRestaurantContainer');
            restaurantDiv.addClass("row container resultWrapper");
            
            //Building Image and appending
            var restaurantIcon = $('<img>');
            restaurantIcon.addClass("resultIcon float-left p-1 img-responsive");
            restaurantIcon.attr('src', 'assets/images/hamburger.png');
            restaurantIcon.attr('alt', 'result icon');
            restaurantDiv.append(restaurantIcon);
            
            //Building Button and appending
            var restaurantButton = $('<button>');
            restaurantButton.addClass("btn btn-success narrower restaurantButtonModalLink");
            restaurantButton.attr('type','button');
            restaurantButton.attr('data-toggle','modal');
            restaurantButton.attr('data-info', JSON.stringify(data[i]));
            restaurantButton.attr('data-target','.hikingModal');
            restaurantButton.text(restaurantName);
            restaurantDiv.append(restaurantButton);
            console.log('Appending Restaurants')
            //Append the div with contents to results area
            $('#restaurantResultsArea').append(restaurantDiv);
        }

        // ONCLICK FUNCTION THAT RENDERS INFO IN THE FORM OF A MODAL FOR EACH RESTAURANT
        $('.restaurantButtonModalLink').on("click", function (event) {
            var restaurantObject = JSON.parse($(this).attr('data-info'));
                                             
            //Append Image
            var image = $('<img>');
            $(image).attr('src', restaurantObject.restaurant.featured_image);
            $(image).attr('alt','Restaurant Featured Image');
            $('.modalImage').empty();
            $('.modalImage').append(image);
            
            //Append Title
            var a = $('<a>');
            $(a).attr('href', restaurantObject.restaurant.url);
            $(a).text(restaurantObject.restaurant.name);
            $(a).attr('target', '_blank');
            $('.modalTitle').empty();
            $('.modalTitle').append(a);

            //Append Location
            var location = $('<h4>');
            $(location).text(restaurantObject.restaurant.location.locality_verbose);
            $('.modalLocation').empty();
            $('.modalLocation').append(location);

            //Append Stats
            //Rating
            var rating = $('<h3>');
            $(rating).text('Rating (1-5): ' + restaurantObject.restaurant.user_rating.aggregate_rating);
            $('#modalRating').empty();
            $('#modalRating').append(rating);

            //Cost
            var difficulty = $('<h3>');
            $(difficulty).text('Avg. Cost for Two($): ' + restaurantObject.restaurant.average_cost_for_two);
            $('#modalDifficulty').empty();
            $('#modalDifficulty').append(difficulty);

            //Cuisine
            var length = $('<h3>');
            $(length).text('Cuisine(s): ' + restaurantObject.restaurant.cuisines);
            $('#modalLength').empty();
            $('#modalLength').append(length);


            //Append Menu Items
            //Menu Text
            var summaryHeader = $('<h3>');
            $(summaryHeader).text('Menu: ');
            $('.modalSummary').empty();
            $('.modalSummary').append(summaryHeader);

            //Append Menu Link
            var a = $('<a>');
            $(a).attr('href', restaurantObject.restaurant.menu_url);
            $(a).text('Click here to view the menu!');
            $(a).attr('target', '_blank');
            $('.modalSummary').empty();
            $('.modalSummary').append(a);

            });
        
    };

    var restaurantAPICalls = function() {
        var queryURL_Restaurant = 'https://developers.zomato.com/api/v2.1/search?start='+currentRestaurantCount+'&count=5&lat='+lat+'&lon='+lng+'&radius=30000';

        $.ajax({
            url: queryURL_Restaurant,
            method: "GET",
            "headers": {
                "user-key": "484b921e03f7cc2c9335696b2d2ff5e3",
                "accept": "application/json"
            }
        }).then(function(responseRestaurantInfo) {
            //console.log ('Restaurant Resutls: '+restaurantResults)
            newRestaurants(responseRestaurantInfo.restaurants)         
        });
    }

    $("#nextRestaurant").on("click", function(){
        if (currentRestaurantCount < 95) {
            currentRestaurantCount += 5;
            console.log('current Restaurant count: ' + currentRestaurantCount);
        } else {
            currentRestaurantCount = 0;
            console.log('current Restaurant count: ' + currentRestaurantCount);
        }
        restaurantAPICalls();
    });

    $("#prevRestaurant").on("click", function(){
        if (currentRestaurantCount <= 0) {
            currentRestaurantCount = 95;
            console.log('current Restaurant count: ' + currentRestaurantCount);
        } else {
            currentRestaurantCount -= 5;
            console.log('current Restaurant count: ' + currentRestaurantCount);
        }
        restaurantAPICalls();
    });

    //End of Restaurant Functions and  Event Listener (Next and Prev buttons) ====================
    
});



