var WebSocket = require('ws');
var request = require('request');
var imageGen = require('./imageGen');

var botToken = process.env.SLACK_BOT_TOKEN;
var apiToken = process.env.SLACK_API_TOKEN;




var trigger = /let's duel/;

function connect () {
	request({
		method: 'GET',
		uri: 'https://slack.com/api/rtm.start',
		qs: {
			token: botToken
		},
		json: true
	}, sockets);
}

function sockets (e, r, b) {
	if (e) {
		throw e;
	}

	var url = b.url;
	var ws = new WebSocket(url);
	var id = 0;
	var ping;
	var pong;


	ws.on('open', function () {
		console.log('Connected.');
	});

	ws.on('hello', function (data, flags) {
	  console.log('Initialized.');
	});

	ws.on('message', function (data, flags) {
		console.log(data);

		data = JSON.parse(data);

		if (/foo/.test(data.text)) {
			console.log('foo detected')
			ws.send(JSON.stringify({
				id: id++,
				type: 'message',
				channel: data.channel,
				text: 'bar'
			}));
		}
	});

	ws.on('error', function (data, flags) {
		throw error;
	});

	ws.on('pong', function (data, flags) {
		console.log(data);
		pong = JSON.parse(data).time;
	});

	setInterval(function () {
		ping = Date.now();
		if (pong && ping - pong > 10000) {
			throw 'Pong out of date';
		}
		ws.send(JSON.stringify({
			id: id++,
			type: 'ping',
			time: ping
		}));
	}, 5000)
}

connect();


