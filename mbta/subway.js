function initMap(){
	//var mbta_key = "0vCoJh8PekiHiZysM9oUWw";
	var ggl_key = "AIzaSyD10iMTA5wzT6wgc3oNd09gzmxp4sBW_aI";
	var mbtaLink = "https://defense-in-derpth.herokuapp.com/redline.json";
	var image = "train.jpeg";
	//var request = new XMLHttpRequest();
	var stationsJSON = '{ "station" : [' +
					'{ "name":"Alewife", "lat":42.395428 , "lon":-71.142483},' +
					'{ "name":"Davis", "lat":42.39674 , "lon":-71.121815},' +
					'{ "name":"Porter", "lat":42.3884 , "lon":-71.119148999999999},' +
					'{ "name":"Harvard Square", "lat":42.373362 , "lon":-71.118956},' +
					'{ "name":"Central Square", "lat":42.365486 , "lon":-71.103802},' +
					'{ "name":"Kendall/MIT", "lat":42.36249079 , "lon":-71.08617653},' +
					'{ "name":"Charles/MGH", "lat":42.361166 , "lon":-71.070628},' +
					'{ "name":"Park Street", "lat":42.35639457 , "lon":-71.0624242},' +
					'{ "name":"Downtown Crossing", "lat":42.355518 , "lon":-71.060225},' +
					'{ "name":"South Station", "lat":42.352271 , "lon":-71.05524200000001},' +
					'{ "name":"Broadway", "lat":42.342622 , "lon":-71.056967},' +
					'{ "name":"Andrew", "lat":42.330154 , "lon":-71.057655},' +
					'{ "name":"JFK/UMass", "lat":42.320685 , "lon":-71.052391},' +
					'{ "name":"Savin Hill", "lat":42.31129 , "lon":-71.053331},' +
					'{ "name":"Fields Corner", "lat":42.300093 , "lon":-71.061667},' +
					'{ "name":"Shawmut", "lat":42.29312583 , "lon":-71.06573796000001},' +
					'{ "name":"Ashmont", "lat":42.284652 , "lon":-71.06448899999999},' +
					'{ "name":"North Quincy", "lat":42.275275 , "lon":-71.029583},' +
					'{ "name":"Wollaston", "lat":42.2665139 , "lon":-71.0203369},' +
					'{ "name":"Quincy Center", "lat":42.251809 , "lon":-71.005409},' +
					'{ "name":"Quincy Adams", "lat":42.233391 , "lon":-71.007153},' +
					'{ "name":"Braintree", "lat":42.2078543 , "lon":-71.0011385}' +
					']}';
	var stations = JSON.parse(stationsJSON);
	var preJFK = [];
	var ashmont = [];
	var braintree = [];
	//var centerCoord;
	function getCoords(){
		console.log("In get coords");
		for (var i = 0; i < stations.station.length; i++) {
			// if (stations.station[i].name == "South Station") {
			// 	centerCoord = {lat: stations.station[i].lat, lng: stations.station[i].lon};
			// };
			if (i == 12) {
				ashmont[0] = stations.station[i];
				braintree[0] = stations.station[i];
			} ;
			if (i < 13) {
				preJFK[i] = stations.station[i];
			} else if (i < 17) {
				ashmont[i-12] = stations.station[i];
			} else{
				braintree[i-16] = stations.station[i];
			};
		}
		console.log("leaving get coords");
	}
	userCoord = getLoc();
	console.log(userCoord);
	getCoords();
	//centerCoord = userCoord;

//Get closest station
/*
	var closest;
	var smallest;
	getClosest();
	function getClosest(){
		var userLatLng = new google.maps.LatLng(userCoord);
		var initLL = new google.maps.LatLng({lat: stations.station[0].lat, lng: stations.station[0].lon});
		var radius = 6368473;
		function compDist(statLL){
			return google.maps.geometry.spherical.computeDistanceBetween(userLatLng, statLL, radius);
		}
		closest = stations.station[0];
		smallest = compDist(initLL);
		for (var i = 1; i < stations.station.length; i++) {
			var stationLL = new google.maps.LatLng({lat: stations.station[i].lat, lng: stations.station[i].lon});
			var dist = compDist(stationLL);
			if (dist < smallest) {
				closest = stations.station[i];
				smallest = dist;
			};
		};
	}
*/

//Put markers on map
	var firstClick = true;
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		//center: centerCoord,
		center: userCoord,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	console.log("made map");
	/*
	var userWindow = new google.maps.InfoWindow({
		content: "The nearest Redline station is " + closest.name + ". It is " +
		smallest + " miles away."
	});
*/
	//var stationWindow = new google.maps.InfoWindow({});
	markers = [];
	var icon = {
		url: image,
		scaledSize: new google.maps.Size(25,25)
	};
	function makeMarker() {
		for (var i = 0; i < stations.station.length; i++) {
			var stat = stations.station[i];
			var coordinates = {lat: stat.lat, lng: stat.lon};
			markers[i] = new google.maps.Marker({
				map: map,
				position: coordinates,
				title: stat.name,
				icon: icon,
				optimized: false

			});
			//markers[i].addListener('click', displayWindow(i));
		};
		console.log("making usermarker");
		var userMarker = new google.maps.Marker({
			map: map,
			position: userCoord,
			title: "Me"
		});
		console.log("made usermarker");
		/*
		userMarker.addListener('click', function() {
			stationWindow.close();
			userWindow.open(map, userMarker);
			if (firstClick){
				makeLine();
				firstClick = false;
			}
		});
*/
	}
	makeMarker();
	/*
	function displayWindow(stationNum){
		var openOn = stations.station[stationNum];
		userWindow.close();
		stationWindow.setContent(getSchedule(openOn));
		stationWindow.open(map, markers[stationNum]);
	}

	var content = "";
	var schedule;
	request.open("GET", mbtaLink, true);
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			data = request.responseText;
			schedule = JSON.parse(data);

		} else if (request.readyState == 4) {
			alert("Trouble connecting to MBTA realtime schedule");
		} 
		else {
			content = "Please wait";
		}
	};
	request.send(null);

	function getSchedule(checkMe) {
		var upcoming = [];
		var count = 0;
		if (schedule != null){
			for (var i = 0; i < schedule.TripList.Trips.length; i++) {
				for (var i = 0; j < schedule.TripList.Trips[i].Predictions[j].length; j++) {
					if (schedule.TripList.Trips[i].Predictions[j].Stop == checkMe.name){
						var secs = schedule.TripList.Trips[i].Predictions[j].Seconds / 60;
						upcoming[count] = {
							dest: schedule.TripList.Trips[i].Destination,
							sec: secs
						};
						count++;
					}
				};
			};
			for (var i = 0; i < count; i++) {
				content += "<p>The train bound for " + upcoming[i].dest + 
				" will be arriving in approximately " + upcoming[i].sec;
				if (upcoming[i].sec < 10) {
					content += " You'd better run if you want to make it</p>";
				} else {
					content += "</p>";
				}
			};
		}

	}

	*/


//Put lines on map

	var JFKPath = [];
	var ashmontPath = [];
	var braintreePath = [];
	for (var i = 0; i < preJFK.length; i++) {
		JFKPath[i] = {lat: preJFK[i].lat, lng: preJFK[i].lon};
	};
	for (var i = 0; i < ashmont.length; i++) {
		ashmontPath[i] = {lat: ashmont[i].lat, lng: ashmont[i].lon};
	};
	for (var i = 0; i < braintree.length; i++) {
		braintreePath[i] = {lat: braintree[i].lat, lng: braintree[i].lon};
	};
	//var userPath = [userCoord, {lat: closest.lat, lng: closest.lng}];
	var toJFKLine = new google.maps.Polyline({
		path: JFKPath,
		strokeColor: '#ff0000',
		strokeWeight: 2,
		map: map
	});
	var toAshmontLine = new google.maps.Polyline({
		path: ashmontPath,
		strokeColor: '#ff0000',
		strokeWeight: 2,
		map: map
	});
	var toBraintreeline = new google.maps.Polyline({
		path: braintreePath,
		strokeColor: '#ff0000',
		strokeWeight: 2,
		map: map
	});
	
	function makeLine(){
		var fromUser = new google.maps.Polyline({
			path: userPath,
			strokeColor: '#00ff00',
			strokeWeight: 2,
			map: map
		});
	}
	
}

function getLoc(){
	console.log("in get loc");
	var myLoc = {lat: 42.360081, lng: -71.058884};
	if (navigator.geolocation) {
		console.log("in id");
		navigator.geolocation.getCurrentPosition(function(position){
			myLoc.lat = position.coords.latitude;
			myLoc.lng = position.coords.longitude;
			console.log(myLoc.lat);
			console.log(myLoc.lng);
		});
	} else {
		console.log("in else");
		alert("Your browser does not support location. \n Assuming you are in the center of Boston");
	}
	return myLoc;
}