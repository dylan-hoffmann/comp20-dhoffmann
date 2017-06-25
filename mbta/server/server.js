var cors = require('cors');
var express = require('express');
var app - express();
app.use(cors());
var data = "http://developer.mbta.com/lib/rthr/red.json"
app.get('/redline.json', function(request, response) {
	response.send(data);
})

app.listen(process.env.PORT || 3000);