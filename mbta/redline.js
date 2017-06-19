/***************\	/***************\	/***************\	/***************\
|**DEPRECIATED**|	|**DEPRECIATED**|	|**DEPRECIATED**|	|**DEPRECIATED**|
|*PLEASE IGNORE*|	|*PLEASE IGNORE*|	|*PLEASE IGNORE*|	|*PLEASE IGNORE*|
\***************|	|***************|	|***************|	|***************/




/*
function initMap(){
	var image = "train.jpeg";
	var centerCoord = {lat:42.352271, lng: -71.0552420000001};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: centerCoord
	});
	var marker = new google.maps.Marker({
		position: centerCoord,
		map: map
	});
*/

function initMap(){
	var api_key = "0vCoJh8PekiHiZysM9oUWw";
	var mbtaURL = "http://realtime.mbta.com/developer/api/v2/stopsbyroute?api_key=0vCoJh8PekiHiZysM9oUWw&route=Red&format=json";
	var image = "train.jpeg";
	var rqst = new XMLHttpRequest();
	var stations = ;

	rqst.onreadystatechange = function(){
		if (this.readyState == XMLHttpRequest.DONE 
			&& this.status == 200){
			stations = JSON.parse(this.responseText);
		}
	};
	rqst.open("GET", mbtaURL, true);
	rqst.send();
	/*
	makeRqst();

	function makeRqst(){
		console.log("Here");
		rqst = new XMLHttpRequest();
		rqst.onreadystatechange = callURL;
		rqst.open('GET', mbtaURL, true);
		rqst.send();
	}
	function callURL(){
		console.log("callUrl");
		if (rqst.readyState === XMLHttpRequest.DONE) {
			if (rqst.status === 200) {
				console.log("if");
				stations = JSON.parse(rqst.responseText);
			}
			else {
				alert('There was an issue retreaving data');
			}
		}
	}
	*/
	console.log(stations);
	var preJFK = [];
	var ashmont = [];
	var braintree = [];
	var centerCoord;
	function getCoords(){
		console.log(stations.direction);
		for (var i = 0; i < stations.direction[0].length; i++) {
			var stat = stations.direction[0].stop[i];
			if(stat.parent_station_name == "South Station") {
				centerCoord = {lat: stat.stop_lat, lng: stat.stop_lon};
			}
			if (stat.stop_order < 120){
				preJFK[i] = stat;
			}
			else if (stat.stop_order == 120){
				braintree[0] = stat;
			}
			else if (stat.stop_order == 130){
				ashmont[0] = stat;
			}
			else if (stat.stop_order < 180) {
				ashmont[i-14] = stat;
			}
			else {
				braintree[i-17] = stat;
			}
		};
	}
	console.log("calling function");
	getCoords();
	// var options = {

	// };
	console.log(centerCoord);
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: centerCoord
		//mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	/*
	markers = [];
	function makeMarker() {
		for (var i = 0; i < stations.direction[0].length; i++) {
			var stat = stations.direction[0].stop[i];
			var coords = {lat: stat.stop_lat, lng: stat.stop_lon};
			markers[i] = new google.maps.Marker({
				map: map,
				position: coords,
				title: stat.parent_station_name,
				icon: image
			});
		};
	}
	var JFKPath = [];
	var ashmontPath = [];
	var braintreePath = [];
	for (var i = 0; i < preJFK.length; i++) {
		JFKPath[i] = {lat: preJFK[i].stop_lat, lng: preJFK[i].stop_lon};
	};
	for (var i = 0; i < ashmont.length; i++) {
		ashmontPath[i] = {lat: ashmont[i].stop_lat, lng: ashmont[i].stop_lon};
	};
	for (var i = 0; i < braintree.length; i++) {
		braintreePath[i] = {lat: braintree[i].stop_lat, lng: braintree[i].stop_lon};
	};
	var toJFKLine = new google.maps.Polyline({
		path: JFKPath,
		strokeColor: '#ff0000',
		strokeWeight: 2
	});
	var toAshmontLine = new google.maps.Polyline({
		path: ashmontPath,
		strokeColor: '#ff0000',
		strokeWeight: 2
	});
	var toBraintreeline = new google.maps.Polyline({
		path: braintreePath,
		strokeColor: '#ff0000',
		strokeWeight: 2
	});
*/
}
