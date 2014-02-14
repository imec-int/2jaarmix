var Motionsound = function (options){

	var init = function (){
		console.log("init motionsensors");
		if (window.DeviceOrientationEvent) {
			// Listen for the deviceorientation event and handle the raw data
			window.addEventListener('deviceorientation', onDeviceorientation, false);
		};
	};

	var onDeviceorientation = function (event) {
		// console.log( Math.round(event.gamma)+" | "+ Math.round(event.beta)+" | "+ Math.round(event.alpha));

		// console.log( Math.round(event.gamma) );

		var degrees = event.gamma;

		// limit to -90 and 90 (so it's the same on Android and iOS)
		if(degrees > 90)
			degrees = 90;

		if(degrees < -90){
			degrees = -90;
		}

		if( -90 < degrees && degrees < 0){
			sendVolumeLeft( Math.abs(degrees)/90 );
		}else if( 0 < degrees && degrees < 90){
			sendVolumeLeft( Math.abs(degrees)/90 );
		}
	};

	var sendVolumeRight = function (value) {
		if(options.onLeftVolumeChanged) options.onLeftVolumeChanged( toLogarithmicScale(value) );
	};


	var sendVolumeLeft = function (value) {
		if(options.onRightVolumeChanged) options.onRightVolumeChanged( toLogarithmicScale(value) );
	};

	function toLogarithmicScale(x) {
	     return x;
	};

	return {
		init: init
	};
};
