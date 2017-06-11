var stationsJSON = '[{"name":"South Station", "lat":42.352271, "long":-71.055242}, 
{"name":"Andrew", "lat":42.330154, "long":-71.057655},
{"name":"Porter Square", "lat":42.3884, "long":-71.11911490},
{"name":"Harvard Square", "lat":42.373362, "long":-71.118956},
{"name":"JFK/UMass", "lat":42.320685, "long":-71.052391},
{"name":"Andrew", "lat":42.330154, "long":-71.057655}]'

var stations = JSON.parse(stations);
initmap(){
	map = new google.maps.Map(document.getElementById('map_div'), {
		center: {lat: stations[0].lat, lng: stations[0].long},
		zoom: 12
	});
}
markers = [];
function makeMarker() {
	for (var i = 0; i < stations.length; i++) {
		var coords = {lat: stations[i].lat, lng: stations[i].long};
		markers[i] = new google.maps.Marker({
			map: map,
			position: coords,
			title: stations[i].name
		});
	};
}