/*
 *		mapanimation.js
 *
 *		Alice Geus
 *		March 6th, 2023
 *
 *		Playing around with the mapbox API and the Metro Phoenix bus data for my class
 *		Just showing the locations in real time of the first 20 busses in the JSON data
 *		Maybe later I could add a method to search for a street and see all busses that are on that
 *		street at the moment, or maybe search for a bus stop and see where the next bus is on it's
 *		way to that stop.
 *
 */
 
/*
 *		Format of the JSON bus data from the valley metro website.
 *
 *		id:								"RTVP:T:18117119"
 *		isDeleted:						false
 *
 *		vehicle:
 *			currentStatus:				"INCOMING_AT"
 *			currentStopSequence:		22
 *
 *			position:
 *				bearing:				19
 *				latitude:				33.515064
 *				longitude:				-112.073586
 *				odometer:				22887
 *				speed:					9.83488
 *
 *			stopId:						"2815"
 *			timestamp:					"1678156495"
 *
 *			trip:
 *				directionId:			0
 *				routeId:				"0"
 *				scheduleRelationship:	"SCHEDULED"
 *				startTime:				"19:20:00"
 *				tripId:					"18117119"
 *			
 *			vehicle:
 *				id:						"5211"
 *				label:					"Dunlap+3rd St"
 *
 */
 
var map;
var url;
var markers;


async function getPhxBusData() {
	let result = await fetch(url);
	let data = await result.json();
	let busses = data.entity.slice(0, 20);
		
	//if there are any busses on the map, remove them before updating
	if(markers!==null) {
		for(let i = markers.length - 1; i >= 0; i--) {
		  markers[i].remove();
		}
	}
	
	//add the list of busses onto the map
	for(let i=0; i<20; i++) {
		markers.push(new mapboxgl.Marker().setLngLat([busses[i].vehicle.position.longitude,
													  busses[i].vehicle.position.latitude]).addTo(map));
	}
	
	return busses;
}

async function run(){
    // get bus data    
	const locations = await getPhxBusData();
	console.log(new Date());
	console.log(locations);

	// refresh in 15 seconds
	setTimeout(run, 15000);
}



window.onload = (event) => {
	mapboxgl.accessToken = 'pk.eyJ1IjoibG9saW5pZWwiLCJhIjoiY2xldnh0OHlzMDQ5MzNvcXBxbTk0bmtidSJ9.4lDMQt3Nr_jiSTqx5jruPA';	//enter your mapbox api key here
	url = 'https://app.mecatran.com/utw/ws/gtfsfeed/vehicles/valleymetro?apiKey=4f22263f69671d7f49726c3011333e527368211f&asJson=true';
	markers = new Array();
	map = new mapboxgl.Map({
	  container: 'map',
	  style: 'mapbox://styles/mapbox/streets-v11',
	  center: [-112.072679, 33.448422],
	  zoom: 12,
	});
	
	run();
}