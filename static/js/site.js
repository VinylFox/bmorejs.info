var BmoreJS = {
  showEvents: function(){
    // Get upcoming events.
    // (generate signed request urls using the meetup api console: http://www.meetup.com/meetup_api/console/)
    var signed_request = "http://api.meetup.com/2/events?group_id=1358121&status=upcoming&order=time&desc=false&offset=0&format=json&page=2&fields=&sig_id=7982375&sig=bbaffddd7a0921bb4c29e155b6a057967c65513b";
    $.getJSON(signed_request + '&callback=?', this.renderEvents);
  },

  renderEvents: function(json){
    var meetupContainer = $("#events");
    $.map(json.results, function(e) {
      setTimeout(function() { BmoreJS.foundEventDate(e.time); }, 10);
      // render the ICanHas template
      return meetupContainer.append(ich.meetupEventView(BmoreJS.enhanceMeetupAPIResults(e)));
    });
  },

  enhanceMeetupAPIResults: function(json){
    // make some pretty date formats using date.js
    json.start_date = new Date(json.time).toString("M/d");
    json.start_time = new Date(json.time).toString("h:mmp");
    return json;
  },
  
  aol: new google.maps.LatLng(39.275236,-76.590985),
  map: undefined,
  
  showMap: function() {
    this.map = new google.maps.Map(document.getElementById("map_canvas"), {
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: this.aol
    });
    var marker = new google.maps.Marker({
      position: this.aol,
      map: this.map
    });
    var infowindow = new google.maps.InfoWindow({
      content: "advertising.com: the bmorejs meetup location"
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(BmoreJS.map, marker);
    });
  },
  
  showDirections: function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(BmoreJS.map);
        var directions = new google.maps.DirectionsService();
        req = {
          origin: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          destination: BmoreJS.aol,
          provideRouteAlternatives: false,
          avoidTolls: true,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL
        };
        directions.route(req, function(result, status) {
          directionsDisplay.setDirections(result);
        });
      }, function(error) {
        if (console && console.info) console.info(error);
      });
    }
  },
  
  // return true if NOW is within `hours` of the time `t`
  nearStartTime: function(t, hours) {
    return (Math.abs(new Date().getTime() - new Date(t)) < hours * 60 * 60 * 1000);
  },
  
  // fired when an event date is parsed from the meetup json
  foundEventDate: function(t) {
    if (this.nearStartTime(t, 4)) {
      $('#directions_control').click(function() {
        $('#map_canvas').toggle();
        BmoreJS.showMap();
        BmoreJS.showDirections();
      });
      $('#directions_control').css('display','block').hide().slideDown(500);
    }
  }
};
