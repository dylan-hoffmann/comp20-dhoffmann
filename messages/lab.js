// Your JavaScript goes here...
function parse(){
	var xmlreq = new XMLHttpRequest();
	var mes = document.getElementById("messages");
	xmlreq.open("GET", "https://messagehub.herokuapp.com/messages.json", true);
	xmlreq.onreadystatechange = function() {
		if (xmlreq.readyState == 4 && xmlreq.status == 200) {
			console.log("All good here");
			message =  xmlreq.responseText;
			data = JSON.parse(message);
			var mes1 = data[0].content;
			var mes2 = data[1].content;
			var user1 = data[0].username;
			var user2 = data[1].username;
			mes.innerHTML = mes1 + " " + user1 + "<br></br>" + mes2 + " " + user2;
		} else if (xmlreq.readyState == 4 && xmlreq.status != 200){
			mes.innerHTML = "Something went wrong, please try again later.";
		} else {
			mes.innerHTML = "Working on it...";
		}
	};

	xmlreq.send(null);
}