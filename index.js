/* ===================== */
/*  Module Dependencies  */
/* ===================== */
var express = require('express');
var cors = require('cors');
var http = require("http");
var axios = require("axios");

/* ======================== */
/*  Module Initialisations  */
/* ======================== */
var server = express();
server.set('port', 3000);
server.use( cors() );

server.listen(server.get('port'), function() {
	console.log('Express server listening on port ' + server.get('port') + '!\n');
});


/* ======================== */
/*     API End - points     */
/* ======================== */
server.all("/apiProxy", async function(req, res) {
	// log entry to function
	console.log("====API request received====\n");

	// check sanity of target url
	let targetUrl = req.query['targetUrl'];
	console.log(" TargetURl => " + targetUrl + "\n");
	if( !targetUrl ) {
		console.log("Not a valid targetUrl!");
		console.log("====API call not made====\n\n");
		return res.send();
	}

	// make call and send respnonse accordingly
	try{
		let response = await axios.get(targetUrl);
		let data = response.data.toString();
		res.send( JSON.stringify( {success: true, data: data}) );
	}
	catch(e) {
		console.log(" **ERROR =>");
		console.error(e);
		res.send( JSON.stringify( {success: false}) );
	}

	// log exit from function
	console.log("====API response sent back====\n\n");

});
