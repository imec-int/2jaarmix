var Konsole = function (konsoleEl) {
	var previousLogEntryEl = null;
	var previousLogEntry = null;
	var previousLogEntryTimes = 0;

	var log = function (str) {
		if(str == previousLogEntry){
			previousLogEntryEl.html( str + ' <b>(' + ++previousLogEntryTimes + ')</b>' );
		}else{
			var logEntryEl = $(document.createElement('div'));
			logEntryEl.html( str );
			$(konsoleEl).append( logEntryEl );

			previousLogEntryTimes = 0;
			previousLogEntry = str;
			previousLogEntryEl = logEntryEl;

			scrollToBottom();
		}
	};

	var scrollToBottom = function () {
		$(konsoleEl).scrollTop($(konsoleEl).get(0).scrollHeight);
	};

	return {
		log: log
	};
}


// dit moet eigenlijk in de main.js om het proper te houden, maar ik wou geen mergeconflicts :-)
window.konsole;
$(function () {
	window.konsole = new Konsole('.konsole');
})