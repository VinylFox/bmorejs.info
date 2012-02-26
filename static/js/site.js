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
      // render the ICanHas template
      return meetupContainer.append(ich.meetupEventView(BmoreJS.enhanceMeetupAPIResults(e)));
    });
  },

  enhanceMeetupAPIResults: function(json){
    // make some pretty date formats using date.js
    json.start_date = new Date(json.time).toString("M/d");
    json.start_time = new Date(json.time).toString("h:mmp");
    return json;
  }
};