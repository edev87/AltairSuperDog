const events = [
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

const getEvents = () => {
  let storedEvents = JSON.parse(localStorage.getItem('ed-events') || '[]');

  if (storedEvents.length == 0) {
    storedEvents = events;
    localStorage.setItem('ed-events', JSON.stringify(events));
  }
  return storedEvents;
}

const buildDropdown = () => {

  // get current events
  let currentEvents = getEvents();

  // get a list of unique cities
  let eventCities = currentEvents.map(e => e.city);
  let distinctCities = new Set(eventCities);  //eliminates duplicates and then returns the unique items
  let dropdownChoices = ['All', ...distinctCities];

  const dropdownDiv = document.getElementById('city-dropdown');
  const dropdownItemTemplate = document.getElementById("dropdown-template");

  dropdownDiv.innerHTML = '';

  // with each unique city:
  dropdownChoices.forEach(choice => {

    // -  copy the dropdown template
    let dropdownItemCopy = dropdownItemTemplate.content.cloneNode(true);

    // - change that copies text
    let aTag = dropdownItemCopy.querySelector('a');
    aTag.innerText = choice;

    // - put in the dropdown
    dropdownDiv.appendChild(dropdownItemCopy);

  })
  document.getElementById('stats-loc').textContent = 'All';
  displayEvents(currentEvents);
  displayStats(currentEvents);

}

const displayEvents = (events) => {

  //find the table
  const eventsTable = document.getElementById('events-table');
  //find the table row template
  const eventTemplate = document.getElementById('table-row-template');

  //clear out the table
  eventsTable.innerHTML = '';

  //for each event:

  for (let i = 0; i < events.length; i++) {
    // -- get one event
    let event = events[i];

    // -- clone the template
    let tableRow = eventTemplate.content.cloneNode(true);

    // -- get each property of en event 
    // -- insert each property ino the cloned template
    let eventNameCell = tableRow.querySelector('[data-id="event"]');
    eventNameCell.innerText = event.event;
    tableRow.querySelector('[data-id="city"]').innerText = event.city;
    tableRow.querySelector('[data-id="state"]').innerText = event.state;
    tableRow.querySelector('[data-id="attendance"]').innerText = event.attendance.toLocaleString();
    tableRow.querySelector('[data-id="date"]').innerText = new Date(event.date).toLocaleDateString();

    // Object.keys(event).forEach(key => {

    // })

    // -- insert the event data into the table
    eventsTable.appendChild(tableRow);
  }
}

const displayStats = (events) => {

  let total = 0;
  let max = 0;
  let min = events[0].attendance;
  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    total += event.attendance;

    if (event.attendance > max) {
      max = event.attendance;
    } else if (event.attendance < min) {
      min = event.attendance;
    }

  }

  let avg = total / events.length;

  document.getElementById('total-attendance').innerHTML = total.toLocaleString();
  document.getElementById('avg-attendance').innerHTML = Math.round(avg).toLocaleString();
  document.getElementById('max-attended').innerHTML = max.toLocaleString();
  document.getElementById('min-attended').innerHTML = min.toLocaleString();

}

const filterEvents = (dropdownItemClicked) => {
  let cityName = dropdownItemClicked.innerText;
  document.getElementById('stats-loc').textContent = cityName;
  let allEvents = getEvents();

  let filteredEvents = [];
  if (cityName == 'All') {
    filterEvents = allEvents
  }
  else {

    filteredEvents = allEvents.filter(event => event.city == cityName);

  }

  displayStats(filteredEvents);  //overall stats
  displayEvents(filteredEvents);  //table

}

const saveEvent = () => {
  let eventName = document.getElementById('event-name').value;
  let city = document.getElementById('city').value;
  let stateSelect = document.getElementById('state');
  let selectedIndex = stateSelect.selectedIndex;
  let selectedOption = stateSelect.options[selectedIndex];
  let state = selectedOption.text;
  let attendance = parseInt(document.getElementById('attendance').value);

  let dateString = document.getElementById('date').value;
  dateString = `${dateString} 00:00`;
  let eventDate = new Date(dateString).toLocaleDateString();

  let newEvent = {
    event: eventName,
    city: city,     
    state: state,
    attendance: attendance,
    date: eventDate,
  };

  let allEvents = getEvents();

  allEvents.push(newEvent);

  localStorage.setItem('ed-events', JSON.stringify(allEvents));

  document.getElementById('newEventForm').reset();

  buildDropdown();

  let modal = bootstrap.Modal.getInstance(document.getElementById('newEventModal'));
  modal.hide();


}

