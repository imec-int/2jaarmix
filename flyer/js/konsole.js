var Konsole = function (options) {
	var konsoleEl = options.el;
	var limit = options.limit;

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

			// limit
			if( $(konsoleEl).children().length > limit){
				for (var i = 0; i < $(konsoleEl).children().length-limit; i++) {
					$(konsoleEl).children()[i].remove();
				};
			}

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
	window.konsole = new Konsole({el:'.konsole', limit: 10});
})