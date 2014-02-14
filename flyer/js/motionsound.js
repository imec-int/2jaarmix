var Motionsound = function (options){

	var init = function (){
		konsole.log("init motionsensors");
		if (window.DeviceOrientationEvent) {
			// Listen for the deviceorientation event and handle the raw data
			window.addEventListener('deviceorientation', onDeviceorientation, false);
		};
	};

	var onDeviceorientation = function (event) {
		konsole.log( Math.round(event.gamma)+" | "+ Math.round(event.beta)+" | "+ Math.round(event.alpha));
	};

	return {
		init: init
	};
};



$(function(){
	var motionsound = new Motionsound();
	motionsound.init();
});

