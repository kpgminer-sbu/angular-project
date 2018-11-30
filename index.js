/* ===================== */
/*  Module Dependencies  */
/* ===================== */
var express = require('express');
var cors = require('cors');
var http = require("http");
var baseUrl = 'http://rest.kegg.jp';


/* ======================== */
/*  Module Initialisations  */
/* ======================== */
var server = express();
server.set('port', 3000);
server.use( cors() );

server.listen(server.get('port'), function() {
	console.log('Express server listening on port ' + server.get('port'));
});


/* ======================== */
/*     API End - points     */
/* ======================== */
server.all("/api/getOrganisms", function(req, res) {
	console.log("Request reached to /api/getOrganisms");

	var pathUrl = '/list/organism';
	let soapRequest = http.get( baseUrl+pathUrl, soapResponse => {
		soapreplyx = "";

		soapResponse.on('data', chunk => {
			soapreplyx += chunk;
		});

		soapResponse.on('end', () => {
			console.log("Sending response for the request!\n");
			return res.send( JSON.stringify(soapreplyx) );
		});
	});

});
