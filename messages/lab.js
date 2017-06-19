// Your JavaScript goes here...
function parse(){
	var xmlreq = new XMLHttpRequest();
	var mes = document.getElementById("messages");
	xmlreq.open("GET", "data.json", true);
	xmlreq.onreadystatechange = function() {
		if (xmlreq.readyState == 4 && xmlreq.status == 200) {
			message =  xmlreq.responseText;
			data = JSON.parse(message);
			var msg = "";
			for (var i = 0; i < data.length; i++){
				msg += "<p>" + data[i].content + " " + data[i].username + "<br></br>";
			}
			mes.innerHTML = msg;
		} else if (xmlreq.readyState == 4 && xmlreq.status != 200){
			mes.innerHTML = "Something went wrong, please try again later.";
		} else {
			mes.innerHTML = "Working on it...";
		}
	};

	xmlreq.send(null);
}
