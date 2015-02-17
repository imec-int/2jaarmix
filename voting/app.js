#!/usr/bin/env node

var express = require('express');
var http = require('http')
var path = require('path');
var utils = require('./utils');
var config = require('./config');
var socketio = require('socket.io');
var url = require('url');
var image = require('./image');
var async = require('async');
var fs = require('fs');

var app = express();
var serverAddress = null;

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	if(!process.env.PORT) app.use(express.logger('tiny')); //show only when debugging locally
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('voting654646416843161'));
	app.use(express.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});


var server = http.createServer(app).listen(app.get('port'), function (){
	console.log("> Webserver listening on port " + app.get('port'));
});

// Socket IO
var io = socketio.listen(server);
io.set('log level', 0);

app.get('/viewer', function (req, res){
	serverAddress = req.protocol + "://" + req.get('host');

	res.render('viewer', {
		title: 'Your Idea Brought to Life',
		participateUrl: serverAddress
	});
});

app.get('/', function (req, res){
	res.render('mobileapp', {
		title: 'Your Idea Brought to Life | Mobile voter'
	});
});


app.post('/xhrupload', function (req, res){
	if(!req.xhr) return utils.sendError(new Error('got no xhr request'), res);

	var size = req.header('x-file-size');
	var type = req.header('x-file-type');
	var name = path.basename(req.header('x-file-name'));

	name =  (Date.now()) + '_' + (utils.removeFileExt(name)).substr(0,6) + path.extname(name);
	var uploadedFile = path.join(__dirname, 'public', 'data', name);

	var ws = fs.createWriteStream( uploadedFile );

	req.on('data', function (data) {
		ws.write(data);
	});

	req.on('end', function () {
		if(config.showDebugInfo) console.log("XHR Upload done");
		ws.end();

		addUserWithImage(uploadedFile, function (err, user) {
			if(err) return utils.sendError(err, res);

			res.json({
				userid: user.id,
				image: utils.wwwdfy(user.image)
			});
		});
	});
});


function addUserWithImage (originalImage, callback) {
	var croppedImage = utils.appendToFilename(originalImage, '_cropped');

	async.waterfall([
		function ($) {
			image.crop(originalImage, 192, 192, croppedImage, $);
		},

		function (imgres, $) {
			db.newUserWithImage(originalImage, croppedImage, $);
		}

	], function (err, user) {
		if(err) return callback(err);
		return callback(null, user);
	});
}


io.sockets.on('connection', function (newSocket) {

	// let's define 2 rooms: viewer & users, see public/mobileapp.js and public/receiver.js
	newSocket.on('room', function (room) {

		if( room == 'viewer'){
			viewerConnected(newSocket);
			// enter room:
			newSocket.join(room);
		}

		if( room == 'users' ){
			userConnected(newSocket);
			// enter room:
			newSocket.join(room);
		}
	});
});

var votingdata = {
	upvotes: 0,
	downvotes: 0
};

function userConnected (socket) {
	console.log('> new user connected (' + getStats() + ')');

	socket.on('vote', function (vote) {
		console.log(votingdata);

		if(vote.up){
			votingdata.upvotes++;
		}

		if(vote.down){
			votingdata.downvotes++;
		}

		io.sockets.in('viewer').emit('votes.changed', votingdata);
	});

	socket.on('disconnect', function() {
		console.log('> user disconnected (' + getStats() + ')');
	});
}


function viewerConnected (socket) {
	console.log('> viewer connected (' + getStats() + ')');
	if(serverAddress) console.log("> Go to '"+serverAddress+"/' to test it out");

	socket.on('event', function (data) {

	});
}


function getStats () {
	return 'users: ' + io.sockets.clients('users').length + ' | viewers: ' + io.sockets.clients('viewer').length;
}

setTimeout(function (argument) {
	console.log('> stats: ' + getStats());
}, 4000);


