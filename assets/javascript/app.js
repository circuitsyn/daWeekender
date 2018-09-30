$(document).ready(function() {


    //Background Image JS
    
    var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'];
    $('#background').css({'background-image': 'url(assets/images/' + images[Math.floor(Math.random() * images.length)] + ')'});
    
    });
    

    //End of Background Image JS
       
       // start of google map and geocode api calls and functions
       // grab our search button ID
       var submitForm = $('#search-button');
       // create on click function to run when we click submit
       submitForm.on("click", function(event) {
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
            //  $('#map').html(map);
    
            // end of google map and geocode api calls and functions
            
            //=========================================================================
            
            // Start of Events API - Meetup.com
            var meetupAPI = '1e26b5231546533317352a49132a2';
            
            $.ajax({
                url: 'https://api.meetup.com/2/open_events?key=' + meetupAPI + '&sign=true&photo-host=public&lat=' + lat + '&lon=' + lng + '&page=9',
                dataType: 'jsonp',
                // Function to call on success
                success: function(data) {
                console.log(data);

                console.log(data.results[0].description); 
                $('#eventCard').empty();
                $('#eventCard').append('<h5 class="card-title">Events</h5>');
                
                for (i=0; i < data.results.length; i++){
                    var link = data.results[i].event_url;
                    var text = data.results[i].name;
                    $('#eventCard').append('<div><a href="' + link + '"> '+ (i+1) + '. ' + text + '</a></div>');
                }

                }
            });
            // End of Events API - Meetup.com
            //==========================================================================
             
            //start of Weather API -- darksky.net

            var today = moment();
                console.log(today["_d"].toString().substring(0,3));
                
                var dayOfWeek = today["_d"].toString().substring(0,3);

                    if (dayOfWeek == "Sat" || dayOfWeek == "Sun") {
                        var requestDay = moment().add(3, "days").unix();
                        console.log("isweekend");

                        var friRequestDay = moment().add(3, "days").day(5);
                        var satRequestDay = moment().add(3, "days").day(6);
                        var sunRequestDay = moment().add(3, "days").day(7);
                            console.log(satRequestDay);

                    }
                    else {
                        var friRequestDay = moment().day(5);
                        var satRequestDay = moment().day(6);
                        var sunRequestDay = moment().day(7);
                            console.log(satRequestDay);
                        

                        console.log("isnotweekend");
                    }

                    //add fri,sat,sun requestDay = itself.unix()



            //creating AJAX call for when search is executed
            $.ajax({
                url:  "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/79f28cba6a99105fef42cde285bc6226/" + lat + "," + lng + "," + requestDay + "+[168]",
                method: "GET"
            }).then(function (data) {
                console.log(data);

                // console.log(data.currently.summary);
                // console.log(data.currently.temperature);
                // console.log(data.daily.summary);
                // console.log(data.daily.data[0].precipType);
                // console.log(data.daily.data.temperatureHigh);
                // console.log(data.daily.data.temperatureLow);
                
                // var utcSeconds = data.daily.data[0].time;
                // var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                // d.setUTCSeconds(utcSeconds);
                // console.log(d);

                var weekendForecast = {
                    friday: {
                        precipType: "",
                        temperatureHigh: 0,
                        temperatureLow: 0
                    },
                    saturday: {
                        precipType: "",
                        temperatureHigh: 0,
                        temperatureLow: 0
                    },
                    sunday: {
                        precipType: "",
                        temperatureHigh: 0,
                        temperatureLow: 0
                    }
                }

                var dailyResponse = data.daily.data;
                console.log(dailyResponse[3]);

                for (var i = 0; i < dailyResponse.length; i++) {
                    console.log(dailyResponse[i]);
                    var utcSeconds = dailyResponse[i].time;
                    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                    d.setUTCSeconds(utcSeconds);
                    console.log(d);





                    



                }


               
            

                
            });


            // end of Weather API -- darksky.net
            //========================================================================
    
    
    
            });
       
    
       });
          
    
       
