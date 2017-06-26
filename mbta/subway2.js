function initMap(){
	var ggl_key = "AIzaSyD10iMTA5wzT6wgc3oNd09gzmxp4sBW_aI";
	var mbtaLink = "https://sheltered-taiga-53164.herokuapp.com/redline.json";
	var locallink = "localhost:3000";
	var train_image = "train_image.jpg";
	var station_image = "train_station.png";
	var meters2miles = 0.00062137119;
	var myLoc = {lat: 42.360081, lng: -71.058884};
	//var request = new XMLHttpRequest();
	var stationsJSON = '{ "station" : [' +
					'{ "name":"Alewife", "lat":42.395428 , "lon":-71.142483, "num": 1},' +
					'{ "name":"Davis", "lat":42.39674 , "lon":-71.121815, "num": 2},' +
					'{ "name":"Porter", "lat":42.3884 , "lon":-71.119148999999999, "num": 3},' +
					'{ "name":"Harvard", "lat":42.373362 , "lon":-71.118956, "num": 4},' +
					'{ "name":"Central", "lat":42.365486 , "lon":-71.103802, "num": 5},' +
					'{ "name":"Kendall/MIT", "lat":42.36249079 , "lon":-71.08617653, "num": 6},' +
					'{ "name":"Charles/MGH", "lat":42.361166 , "lon":-71.070628, "num": 7},' +
					'{ "name":"Park Street", "lat":42.35639457 , "lon":-71.0624242, "num": 8},' +
					'{ "name":"Downtown Crossing", "lat":42.355518 , "lon":-71.060225, "num": 9},' +
					'{ "name":"South Station", "lat":42.352271 , "lon":-71.05524200000001, "num": 10},' +
					'{ "name":"Broadway", "lat":42.342622 , "lon":-71.056967, "num": 11},' +
					'{ "name":"Andrew", "lat":42.330154 , "lon":-71.057655, "num": 12},' +
					'{ "name":"JFK/UMass", "lat":42.320685 , "lon":-71.052391, "num": 13},' +
					'{ "name":"Savin Hill", "lat":42.31129 , "lon":-71.053331, "num": 14},' +
					'{ "name":"Fields Corner", "lat":42.300093 , "lon":-71.061667, "num": 15},' +
					'{ "name":"Shawmut", "lat":42.29312583 , "lon":-71.06573796000001, "num": 16},' +
					'{ "name":"Ashmont", "lat":42.284652 , "lon":-71.06448899999999, "num": 17},' +
					'{ "name":"North Quincy", "lat":42.275275 , "lon":-71.029583, "num": 18},' +
					'{ "name":"Wollaston", "lat":42.2665139 , "lon":-71.0203369, "num": 19},' +
					'{ "name":"Quincy Center", "lat":42.251809 , "lon":-71.005409, "num": 20},' +
					'{ "name":"Quincy Adams", "lat":42.233391 , "lon":-71.007153, "num": 21},' +
					'{ "name":"Braintree", "lat":42.2078543 , "lon":-71.0011385, "num": 22}' +
					']}';
	var stations = JSON.parse(stationsJSON);
	var preJFK = [];
	var ashmont = [];
	var braintree = [];
	var markers = [];
	var refresh = 15000;

	function getCoords(){
		for (var i = 0; i < stations.station.length; i++) {
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
	}

	function getLoc(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function(position){
					myLoc.lat = position.coords.latitude;
					myLoc.lng = position.coords.longitude;
					updateLoc(myLoc);
				}, 
				function(err) {
					alert("geolocation error, assuming you are in the center of Boston");
					updateLoc(myLoc);
				}, 
				options = {
					timeout: 5000
				});
		} 
		else {
			alert("Your browser does not support location. \n" +
				  "Assuming you are in the center of Boston");
		}
	}
	
	function updateLoc(me){
		map.panTo(me)
		userCoord = me;
		getClosest();
		makeMarker();
		placeLines();
	}
	
	userCoord = myLoc;

	getLoc();
	getCoords();
	

//Get closest station

	var closest;
	var smallest;
	function getClosest(){
		var userLatLng = new google.maps.LatLng(userCoord);
		var initLL = new google.maps.LatLng({lat: stations.station[0].lat, lng: stations.station[0].lon});
		function compDist(statLL){
			return google.maps.geometry.spherical.computeDistanceBetween(userLatLng, statLL);
		}
		closest = stations.station[0];
		smallest = compDist(initLL) * meters2miles;
		for (var i = 1; i < stations.station.length; i++) {
			var stationLL = new google.maps.LatLng({lat: stations.station[i].lat, lng: stations.station[i].lon});
			var dist = compDist(stationLL) *meters2miles;
			if (dist < smallest) {
				closest = stations.station[i];
				smallest = dist;
			};
		};
	}


//Put markers on map

	var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 11,
			center: userCoord,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	
	var userWindow = new google.maps.InfoWindow({});
	var stationWindow = new google.maps.InfoWindow({
		content: "<div id='stationwin'>lorumIpsum</div>"
	});
	var trainWindow = new google.maps.InfoWindow({});
	stationWindow.addListener('closeclick', function(){
		clearInterval(drawInterval);
	});
	
	var station_icon = {
		url: station_image,
		scaledSize: new google.maps.Size(35,35)
	};
	var train_icon = {
		url: train_image,
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
				icon: station_icon,
				optimized: false
			});
		};
		function waitForClick(i){
			markers[i].addListener('click', function(){
				displayWindow(stations.station[i]);
			});

		}
		for (var i = 0; i < markers.length; i++) {
			waitForClick(i);
		};
		var userMarker = new google.maps.Marker({
			map: map,
			position: userCoord,
			title: "Me",

		});
		var firstClick = true;
		userMarker.addListener('click', function() {
			stationWindow.close();
			trainWindow.close();
			clearInterval(drawInterval);
			userWindow.setContent("The nearest Redline station is " + closest.name + 
								  ". It is " + smallest + " miles away.");
			userWindow.open(map, userMarker);
			if (firstClick){
				makeLine();
				firstClick = false;
			}
		});

	}

	var drawInterval;
	function displayWindow(station){
		userWindow.close();
		stationWindow.close();
		trainWindow.close();
		clearInterval(drawInterval);
		stationWindow.open(map, markers[station.num-1]);
		document.getElementById('stationwin').innerHTML = getSchedule(station);
		drawInterval = setInterval(function(){
			document.getElementById('stationwin').innerHTML = getSchedule(station);
		}, refresh);
	}

	var content = "";
	var schedule;
	(getJSON());
	var jsonInterval = setInterval(getJSON, refresh);

	function getJSON(){
		var request = new XMLHttpRequest();	
		request.open("GET", mbtaLink, true);
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				data = request.responseText;
				schedule = JSON.parse(data);
				drawTrains();
			} else if (request.readyState == 4) {
				alert("Trouble connecting to MBTA realtime schedule");
			} else {
				content = "Please wait";
			}
		};
		request.send(null);
	}

	function redrawWindow(){
		getSchedule()
	}

	function fixedName(stationName){
		var betterName = "";
		for(var i = 0; i < stationName.length -1; i++){
			if (stationName[i+1] == "-"){
				return betterName;
			}
			else {
				betterName += stationName[i];
			}
		}
		betterName += stationName[stationName.length-1];
		return betterName;
	}

	function getSchedule(checkMe){
		var inoutbound = [];
		//var upcoming = [];
		var count = 0;
		if (schedule != null){
			content = "<h1>" + checkMe.name + " Station</h1>";
			for (var k = 0; k < 2; k++){
				var upcoming = [];
				count = 0;
				for (var i = 0; i < schedule.mode[0].route[0].direction[k].trip.length; i++) {
					for (var j = 0; j < schedule.mode[0].route[0].direction[k].trip[i].stop.length; j++) {
						console.log(schedule.mode[0].route[0].direction[k].trip[i]);
						if (fixedName(schedule.mode[0].route[0].direction[k].trip[i].stop[j].stop_name) == checkMe.name){
							var secs = schedule.mode[0].route[0].direction[k].trip[i].stop[j].pre_away;
							upcoming[count] = {
								dest: schedule.mode[0].route[0].direction[k].trip[i].trip_name,
								sec: secs
							};
							count++;
						}
					};
				};
				inoutbound[k] = {
					title: schedule.mode[0].route[0].direction[k].direction_name,
					upcoming: upcoming,
					upcomingCount: count
				};
			};
			for (var k = 0; k < 2; k++){
				content += "<h2>" + inoutbound[k].title + "</h2>";
				for (var i = 0; i < inoutbound[k].upcomingCount; i++) {
					if (inoutbound[k].upcoming[i].sec > 0) {
						content += "<p>The " + inoutbound[k].upcoming[i].dest + 
						" will be arriving in approximately ";
						if (inoutbound[k].upcoming[i].sec < 60) {
							content += inoutbound[k].upcoming[i].sec + " seconds."
						} else if (Math.round(inoutbound[k].upcoming[i].sec/60) == 1) {
							content += Math.round(inoutbound[k].upcoming[i].sec/60) + " minute.";
						} else {
							content += Math.round(inoutbound[k].upcoming[i].sec/60) + " minutes.";
						}
						if (inoutbound[k].upcoming[i].sec < 120) {
							content += " You'd better run if you want to make it</p>";
						} else {
							content += "</p>";
						}
					}
				};
			}
			return content;
		}
		/*
		var upcoming = [];
		var count = 0;
		if (schedule != null){
			content = "<h1>" + checkMe.name + " Station</h1>";
			for (var i = 0; i < schedule.mode[0].route[0].direction[0].trip.length; i++) {

				for (var j = 0; j < schedule.mode[0].route[0].driplist.Trips[i].Predictions.length; j++) {
					if (schedule.mode[0].route[0].driplist.Trips[i].Predictions[j].Stop == checkMe.name){
						var secs = schedule.mode[0].route[0].driplist.Trips[i].Predictions[j].Seconds;
						upcoming[count] = {
							dest: schedule.mode[0].route[0].driplist.Trips[i].Destination,
							sec: secs
						};
						count++;
					}
				};
			};
			for (var i = 0; i < count; i++) {
				if (upcoming[i].sec > 0) {
					content += "<p>The train bound for " + upcoming[i].dest + 
					" will be arriving in approximately ";
					if (upcoming[i].sec < 60) {
						content += upcoming[i].sec + " seconds."
					} else if (Math.round(upcoming[i].sec/60) == 1) {
						content += Math.round(upcoming[i].sec/60) + " minute.";
					} else {
						content += Math.round(upcoming[i].sec/60) + " minutes.";
					}
					if (upcoming[i].sec < 120) {
						content += " You'd better run if you want to make it</p>";
					} else {
						content += "</p>";
					}
				}
			};
			return content;
		}
		*/
	}


//Put lines on map
	function placeLines(){
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
	}
	function makeLine(){
		var userPath = [userCoord, {lat: closest.lat, lng: closest.lon}];
		var fromUser = new google.maps.Polyline({
			path: userPath,
			strokeColor: '#00ff00',
			strokeWeight: 2,
			map: map
		});
	}
	var trainMarkers = [];
	var trainDest = [];
	var count = 0;
	function drawTrains(){
		for (var i = 0; i < count; i++){
			trainMarkers[i].setMap(null);
		}
		trainMarkers = [];
		trainDest = [];
		count = 0;
		if (schedule != null){
			for (var i = 0; i < schedule.mode[0].route[0].direction[0].trip.length; i++) {
				var currTrain = schedule.mode[0].route[0].direction[0].trip[i];
				if (currTrain.vehicle != null){
					var trainLoc = {lat: parseFloat(currTrain.vehicle.vehicle_lat), lng: parseFloat(currTrain.vehicle.vehicle_lon)};
					trainMarkers[count] = new google.maps.Marker({
						position: trainLoc,
						title: currTrain.vehicle.vehicle_label,
						map: map,
						icon: train_icon
					});
					trainDest[count] = currTrain.trip_headsign;
					count++;
				}
			};
		}
		function displayTrainWindow(index){
			userWindow.close();
			stationWindow.close();
			clearInterval(drawInterval);
			var s = "<h2>" + trainMarkers[index].title + "</h2><p>This is the approximate location" +
			" of train " + trainMarkers[index].title + " bound for " + trainDest[index] + ".</p>";
			trainWindow.setContent(s);
			trainWindow.open(map, trainMarkers[index]);

		}
		function waitForTrainClick(i){
			trainMarkers[i].addListener('click', function(){
				displayTrainWindow(i);
			})
		}
		for (var i = 0; i < trainMarkers.length; i++) {
			waitForTrainClick(i);
		};
	}
	//(drawTrains());
	//var trainInterval = setInterval(drawTrains, refresh);
}

