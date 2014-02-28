$(function(){
	$(document.body).delegate('button, .button', 'touchstart', function (event){
		if( $(event.target).prop('disabled') ) return;
		$(this).addClass('highlight');
	});

	$(document.body).delegate('button, .button', 'touchend', function (event){
		if( $(event.target).prop('disabled') ) return;
		$(this).removeClass('highlight');
	});

	$(document.body).delegate('button, .button', 'mousedown', function (event){
		if( $(event.target).prop('disabled') ) return;
		$(this).addClass('highlight');
	});

	$(document.body).delegate('button, .button', 'mouseup', function (event){
		if( $(event.target).prop('disabled') ) return;
		$(this).removeClass('highlight');
	});
});