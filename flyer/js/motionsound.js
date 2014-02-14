var Motionsound = function (options){

	var init = function (){
		konsole.log("init motionsensors");
		if (window.DeviceOrientationEvent) {
			// Listen for the deviceorientation event and handle the raw data
			window.addEventListener('deviceorientation', onDeviceorientation, false);
		};
	};

	var onDeviceorientation = function (event) {
		// konsole.log( Math.round(event.gamma)+" | "+ Math.round(event.beta)+" | "+ Math.round(event.alpha));

		// konsole.log( Math.round(event.gamma) );

		var degrees = event.gamma;

		// limit to -90 and 90 (so it's the same on Android and iOS)
		if(degrees > 90)
			degrees = 90;

		if(degrees < -90){
			degrees = -90;
		}

		if( -90 < degrees && degrees < 0){
			if(options.onLeftVolumeChanged) options.onLeftVolumeChanged( Math.abs(degrees)/90 );
		}else if( 0 < degrees && degrees < 90){
			if(options.onRightVolumeChanged) options.onRightVolumeChanged( Math.abs(degrees)/90 );
		}
	};

	return {
		init: init
	};
};


// knippen en plakken in de main.js en gebruiken waar nodig:

$(function(){
	var motionsound = new Motionsound({
		onLeftVolumeChanged: leftVolumeChanged,
		onRightVolumeChanged: rightVolumeChanged
	});
	motionsound.init();
});


function leftVolumeChanged(value){
	// value is een waarde tussen 0 en 1
	konsole.log( 'left volume: ' + Math.round(value*100)/100 );
}


function rightVolumeChanged(value){
	// value is een waarde tussen 0 en 1
	konsole.log( 'right volume: ' + Math.round(value*100)/100 );
}