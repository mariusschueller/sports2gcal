var teams = ["minnesota united", "minnesota vikings"]

function main() {
  teams.forEach(team => {
    console.log(team);
    fetchData(team);
  });
}

function fetchData(team) {
  try {
    var encodedTeam = encodeURIComponent(team);
    var url = 'https://site.web.api.espn.com/apis/search/v2?query=' + encodedTeam + '&limit=1';
    
    var response = UrlFetchApp.fetch(url);
    var jsonText = response.getContentText();
    var data = JSON.parse(jsonText);
    
    var raw_uid = data.results[0].contents[0].uid;
    var league = data.results[0].contents[0].defaultLeagueSlug;
    var name = data.results[0].contents[0].displayName;
    var sport = data.results[0].contents[0].sport;

    var id = raw_uid.slice(raw_uid.indexOf("~t:") + 3);

    Logger.log(id + " " + league + " " + name + " " + sport);
    fetchSchedule(id, league, sport, name);
  } catch (error) {
    Logger.log('Request failed for ' + team + ': ' + error.toString());
  }
}

function fetchSchedule(id, league, sport, name) {
  try {
    // Added current year dynamically to ensure we get the right season
    var currentYear = new Date().getFullYear();
    var url = 'https://site.web.api.espn.com/apis/site/v2/sports/'
            + sport + '/' + league + '/teams/' + id + '/schedule?season=' + currentYear+"&fixture=true";
            
    Logger.log(url);
    var response = UrlFetchApp.fetch(url);
    
    var jsonText = response.getContentText();
    var data = JSON.parse(jsonText);
    
    data.events.forEach(event => {
      createCalEvent(event.name, event.date);
    });
    
  } catch (error) {
    Logger.log('Schedule request failed: ' + error.toString());
  }
}

function createCalEvent(name, date) {
  var calendar = CalendarApp.getDefaultCalendar();
  
  var startTime = new Date(date);
  var now = new Date();
  
  // 1. Check if the game is in the past
  if (startTime < now) {
    Logger.log('Skipping past event: ' + name);
    return; // Exit the function early
  }
  
  var endTime = new Date(startTime.getTime() + (2.5 * 60 * 60 * 1000));
  
  // Duplicates
  var existingEvents = calendar.getEvents(startTime, endTime);
  var isDuplicate = false;
  
  for (var i = 0; i < existingEvents.length; i++) {
    if (existingEvents[i].getTitle() === name) {
      isDuplicate = true;
      break; 
    }
  }
  
  if (isDuplicate) {
    Logger.log('Duplicate found, skipping: ' + name);
    return; // Exit early
  }
  
  // Create the event if it's in the future and not a duplicate
  calendar.createEvent(name, startTime, endTime);
  Logger.log('Event successfully created: ' + name);
}

