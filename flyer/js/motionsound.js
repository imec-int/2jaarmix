var Motionsound = function (options){

	var zeroOffset = 0.04;
	var minAngle = -80; // limit to -30 and 30 (don't go further than -90 and 90, as that's the Android limit)
	var maxAngle = 80;

	var init = function (){
		console.log("init motionsensors");
		if (window.DeviceOrientationEvent) {
			// Listen for the deviceorientation event and handle the raw data
			window.addEventListener('deviceorientation', onDeviceorientation, false);
		};
	};

	var onDeviceorientation = function (event) {
		konsole.log( Math.round(event.gamma)+" | "+ Math.round(event.beta)+" | "+ Math.round(event.alpha));

		// console.log( Math.round(event.gamma) );

		var degrees = event.beta;

		if(degrees > maxAngle)
			degrees = maxAngle;

		if(degrees < minAngle){
			degrees = minAngle;
		}

		// konsole.log(degrees);

		if( minAngle < degrees && degrees < 0){
			sendVolumeLeft( Math.abs(degrees/minAngle) );
		}else if( 0 < degrees && degrees < maxAngle){
			sendVolumeRight( Math.abs(degrees/maxAngle) );
		}
	};

	var sendVolumeLeft = function (value) {
		value = Math.max(0, value-zeroOffset);
		value = value/(1-zeroOffset);

		if(options.onLeftVolumeChanged) options.onLeftVolumeChanged( toLogarithmicScale(value) );
	};


	var sendVolumeRight = function (value) {
		value = Math.max(0, value-zeroOffset);
		value = value/(1-zeroOffset);

		if(options.onRightVolumeChanged) options.onRightVolumeChanged( toLogarithmicScale(value) );
	};

	function toLogarithmicScale(x) {
	     return Math.sin(x * Math.PI / 2);
	};

	return {
		init: init
	};
};
