//Events API - Meetup.com
$('#topic-input').click(function(){
    
    $.ajax({
        url: 'https://api.meetup.com//2/open_events?key=1e26b5231546533317352a49132a2&group_urlname=ny-tech&sign=true',
        dataType: 'jsonp',
      // Function to call on success
    	success: function(data) {
        
          console.log('returned data: ' + data);
          console.log(data);
      	}
    	});
    	
  	});
    
