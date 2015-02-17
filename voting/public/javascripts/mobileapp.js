var MobileApp = function (options){

	var socket = null;
	var userid = null;

	var init = function (){
		console.log("init");
		initSocket();
		addHandlers();
		FastClick.attach(document.body);
	};

	var initSocket = function (){
		if(socket) return; // already initialized

		socket = io.connect(window.location.hostname);

		// some debugging statements concerning socket.io
		socket.on('reconnecting', function(seconds){
			console.log('reconnecting in ' + seconds + ' seconds');
		});
		socket.on('reconnect', function(){
			console.log('reconnected');
		});
		socket.on('reconnect_failed', function(){
			console.log('failed to reconnect');
		});
		// add ourselves to the 'users' room
		socket.on('connect', function() {
			socket.emit('room', 'users');
		});
	};

	var addHandlers = function () {
		$('#fileinput').bind('change', onFileuploadChange);
		$('.q').click( onQclick );
		$('.screw').click( onScrewClick );
	};

	var onFileuploadChange = function (event){
		$('.spinner').show();

		uploadImage(event.target.files[0], function (data){
			console.log(data);

			userid = data.userid;
			$('.picturebutton .userimage').attr('src', data.image);
			$('.spinner').hide();
		});
	};

	var uploadImage = function(file, callback){
		console.log("uploading file");
		console.log(file);

		var xhr = new XMLHttpRequest(),
			upload = xhr.upload;

		upload.addEventListener("progress", function (ev) {
			if (ev.lengthComputable) {
				var percentage = (ev.loaded / ev.total) * 100 + "%";
				console.log(percentage);
			}
		}, false);

		upload.addEventListener("load", function (ev) {
			console.log("upload complete");
		}, false);

		upload.addEventListener("error", function (ev) {
			console.log(ev);
		}, false);

		xhr.open(
			"POST",
			"/xhrupload"
		);
		xhr.setRequestHeader("Cache-Control", "no-cache");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.setRequestHeader("Content-Type", file.type);
		xhr.setRequestHeader("X-File-Name", file.name);

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				callback( JSON.parse(xhr.responseText) );
			}
		}

		xhr.send(file);
	};

	var onQclick = function (event) {
		socket.emit('vote', {userid: userid, up:true});
		$('.youvoted').show();
	};

	var onScrewClick = function (event) {
		socket.emit('vote', {userid: userid, down:true});
		$('.youvoted').show();
	};

	return {
		init: init
	};
};



$(function(){
	var mobileApp = new MobileApp();
	mobileApp.init();
});


