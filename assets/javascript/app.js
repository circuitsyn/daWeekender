$(document).ready(function() {
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
    $('#background').css({'background-image': 'url(assets/images/' + images[Math.floor(Math.random() * images.length)] + ')'});
    
    
    
    //End of Background Image JS
       
       // start of google map and geocode api calls and functions
       // grab our search button ID
       var submitForm = $('#search-button');
       // create on click function to run when we click submit
       submitForm.on("click", function(event) {
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
                 center: {lat: lat, lng: lng},
                 // choose our zoom
                 zoom: 8
               });
               // create marker variable 
               var marker = new google.maps.Marker({
                   // grab lat and lng for our positioning, same as our center
               position:{lat: lat, lng: lng},
               // put it on the same map
               map:map,
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
                success: function(data) {
                console.log("Events API Data:");
                console.log(data);

                // $('#resultArea').empty();
                // $('#resultArea').append('<h5 class="card-title">Events</h5>');
                
                for (i=0; i < data.results.length; i++){
                    var link = data.results[i].event_url;
                    var text = data.results[i].name;
                    
                    //apppend event api events to card
                    $('#eventResultArea').append('<div id="resultEntry" class="row container"><div class="resultWrapper"><img class="resultIcon float-left p-1 img-responsive" src="assets/images/eventIcon.png" alt="result icon"><a class="linkMod" href="' + link + '"' + ' target="_blank">' + text + '</a></div></div>');
                }

                }
            });
            // End of Events API - Meetup.com
            //==========================================================================
             
            //start of Weather API -- openweathermap.com
            var URL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lng + "&units=imperial&appid=15db84bc602de5658332f59736c7f92c"
            //creating AJAX call for when search is executed
            $.ajax({
                url: URL,
                method: "GET"
            }).then(function (data) {
                console.log("Weather API Data:");
                console.log(data)
            });
            // end of Weather API -- openweathermap.com
            //========================================================================
            
            // Start of Hiking API ====================

            var maxDistance = 30;
            var queryURL_Hiking = 'https://www.hikingproject.com/data/get-trails?lat='+lat+'&lon='+lng+'&maxDistance='+maxDistance+'&key=200364142-c73ec0ae2d02db6031cef492b6b86f45'
            $.ajax({
                url: queryURL_Hiking,
                method: "GET"
            }).then(function(responseHikingInfo) {
                
                //console.log(queryURL_Hiking);
                console.log("Hiking API Data:");
                console.log(responseHikingInfo);
                var numberOfTrails = responseHikingInfo.trails.length;
                
                //console.log ('number of trails available within max distance: '+numberOfTrails)
                for (var i = 0; i < numberOfTrails; i++) {
                    var locationURL = responseHikingInfo.trails[i].url;
                    var locationName = responseHikingInfo.trails[i].name;
                    // $('#hikingCard').append('<div><a href="' + locationURL + '"> '+ (i+1) + '. ' + locationName + '</a></div>');
                    $('#hikingResultsArea').append('<div id="resultEntry" class="row container"><div class="resultWrapper"><img class="resultIcon float-left p-1 img-responsive" src="assets/images/tree.png" alt="result icon"><a class="linkMod" href="' + locationURL + '"' + ' target="_blank">' + locationName + '</a></div></div>');

                }

            });

            // End of Hiking API ====================


            // Start of Restaurant API ====================

            var queryURL_Restaurant = 'https://developers.zomato.com/api/v2.1/search?count=15&lat='+lat+'&lon='+lng+'&radius='+maxDistance;

            $.ajax({
                url: queryURL_Restaurant,
                method: "GET",
                "headers": {
                    "user-key": "484b921e03f7cc2c9335696b2d2ff5e3",
                    "accept": "application/json"
                }
            }).then(function(responseRestaurantInfo) {
                //console.log(queryURL_Restaurant);
                console.log("Retaurant API Data:");
                console.log(responseRestaurantInfo);
                var numberOfRestaurants = responseRestaurantInfo.restaurants.length;
                //console.log ('number of restaurant available within max distance: '+numberOfRestaurants);

                // $('#restaurantCard').empty();
                // $('#restaurantCard').append('<h5 class="card-title">Restaurants</h5>');
                for (var i = 0; i < numberOfRestaurants; i++){
                    var restaurantURL = responseRestaurantInfo.restaurants[i].restaurant.url;
                    var restaurantName = responseRestaurantInfo.restaurants[i].restaurant.name;
                    // $('#restaurantCard').append('<div><a href="' + restaurantURL + '"> '+ (i+1) + '. ' + restaurantName + '</a></div>');
                    $('#restaurantResultsArea').append('<div id="resultEntry" class="row container"><div class="resultWrapper"><img class="resultIcon float-left p-1 img-responsive" src="assets/images/hamburger.png" alt="result icon"><a class="linkMod" href="' + restaurantURL + '"' + ' target="_blank">' + restaurantName + '</a></div></div>');
   
                    
                }
            });
            // End of Restaurant API ====================

    
    
            });
       
    
       });
}); 
    
       
