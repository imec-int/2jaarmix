var Viewer = function (options){
	var $body = $('body');

	var socket;

	var init = function () {
		console.log("init");
		initSocket();
	};

	var initSocket = function (){
		if(socket) return; // already initialized

		// socket.io initialiseren
		socket = io.connect(window.location.hostname);
		// some debugging statements concerning socket.io
		socket.on('reconnecting', function(seconds){
			console.log('reconnecting in ' + seconds + ' seconds');
		});
		socket.on('reconnect', function(){
			console.log('reconnected');
			// onRefreshPage();
		});
		socket.on('reconnect_failed', function(){
			console.log('failed to reconnect');
		});
		// add ourselves to the 'viewer' room
		socket.on('connect', function() {
			socket.emit('room', 'viewer');
		});

		socket.on('votes.changed', onVotesChanged);
		socket.on('users.add', onUserAdd);
		socket.on('users.clear', onUsersClear);
	};

	var onVotesChanged = function (votingdata) {
		console.log(votingdata);

		var total = votingdata.upvotes + votingdata.downvotes;
		var percentageUpvotes = votingdata.upvotes*100/total;
		var percentageDownvotes = votingdata.downvotes*100/total;

		if(total == 0){
			percentageUpvotes = 0;
			percentageDownvotes = 0;
		}

		$('.upvotes .fill').css({width: percentageUpvotes + '%'});
		$('.downvotes .fill').css({width: percentageDownvotes + '%'});


		if(votingdata.upvotes>0)
			$('.upvotes .fill .number').text(votingdata.upvotes);
		else
			$('.upvotes .fill .number').text('');

		if(votingdata.downvotes)
			$('.downvotes .fill .number').text(votingdata.downvotes);
		else
			$('.downvotes .fill .number').text('');

	};

	var moveElement = function (el_, x, y, seconds, easing, callback) {
		var el, $el;
		if(el_.jquery){
			el = el_[0];
			$el = el_;
		}else{
			el = el_;
			$el = $(el_);
		}

		//force css rendering by requesting some trivial css-property, forces the browser to render all previous css:
		$el.css('width');

		if(callback){
			function c () {
				$el.unbind('webkitTransitionEnd', c);
				callback(el);
			}

			$el.bind('webkitTransitionEnd', c);
		}

		if(seconds){
			el.style.webkitTransitionProperty = '-webkit-transform';
			el.style.webkitTransitionTimingFunction = easing;
			el.style.webkitTransitionDuration = seconds + 's';
		}else{
			el.style.webkitTransitionProperty = '';
			el.style.webkitTransitionTimingFunction = '';
			el.style.webkitTransitionDuration = 0;
		}

		el.style.webkitTransform = 'translate3d('+x+','+y+',0) scale3d(1,1,1)';
	};

	var onUserAdd = function (data) {
		var img = $(document.createElement('img')).addClass('user').attr('src', data.userimage);

		if(data.vote.up){
			$('.qers>.users').prepend(img);
		}

		if(data.vote.down){
			$('.screwers>.users').prepend(img);
		}
	};

	var onUsersClear = function () {
		$('.qers>.users').empty();
		$('.screwers>.users').empty();
	};

	return {
		init: init
	};
};


$(function(){
	var viewer = new Viewer();
	viewer.init();
});




