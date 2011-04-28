var MeetupAPI = {
  dependencies: {
    iCanHaz: ["https://github.com/andyet/ICanHaz.js/raw/master/ICanHaz.min.js", "ICanHaz.js"],
    date: ["date.js"],
    jquery: ["https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js", "jquery.js"]
  },
  
  get: function(){
    $.getJSON("api/meetup.json", this.onCollect);
  },
  
  onCollect: function(meetupFeed){
    $(document).ready(function(){ //Woo hoops to jump through.
      MeetupAPI.collection = meetupFeed;
      MeetupAPI.render();
    });
  },
  
  parseMeetup: function(data){
    //"Tue May 24 19:00:00 EDT 2011" -> "May 24 19:00:00"
    var date_chomped = data["time"].split(" ").slice(1,4).join(" ");
    var date = Date.parse(date_chomped);
    var meetupData= {
     rsvps: data["rsvpcount"],
     day: date.toString("M/d"),
     hour: date.toString("h:mmp"),
     description: data["description"], // Use {{{}}} because this has inline html
     name: data["name"]
    };
    return meetupData;
  },

  render: function(){
    var meetupContainer = $("#lc"); //pull this out into the constructor
    var meetupViews = $.map(MeetupAPI.collection["results"], function(apiEventData){
      return meetupContainer.append(ich.meetupEventView(MeetupAPI.parseMeetup(apiEventData)));
    });
  }
};