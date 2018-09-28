$(document).ready(function() {

//Events API - Meetup.com
$(document).on("click", function(){
    console.log('submitted');
    var meetupAPI = '1e26b5231546533317352a49132a2';
    var lat = 47.475093;
    var lng = -122.230090;
    $.ajax({
        url: 'https://api.meetup.com/2/open_events?key=' + meetupAPI + '&sign=true&photo-host=public&lat=' + lat + '&lon=' + lng + '&page=9',
        dataType: 'jsonp',
      // Function to call on success
    	success: function(data) {
        console.log(data);
          
      	}
    });
    	
  	});
// End of Events API - Meetup.com

//Background Image JS

    var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'];
    $('#background').css({'background-image': 'url(assets/images/' + images[Math.floor(Math.random() * images.length)] + ')'});

   });

//Enf of Background Image JS
