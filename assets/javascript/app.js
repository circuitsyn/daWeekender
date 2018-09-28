//Background Image JS

$(document).ready(function() {

    var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'];
    $('#background').css({'background-image': 'url(assets/images/' + images[Math.floor(Math.random() * images.length)] + ')'});
   });

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
   });
   
   });
      // end of google map and geocode api calls and functions
