var Konsole = function (options) {
	var konsoleEl = options.el;
	var limit = options.limit;
	var hidden = options.hidden;

	var previousLogEntryEl = null;
	var previousLogEntry = null;
	var previousLogEntryTimes = 0;

	hide();

	var log = function (str) {
		if(hidden) return;

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

	var show: function () {
		hidden = false;
		$(konsoleEl).show();
	};

	var hide: function () {
		hidden = true;
		$(konsoleEl).hide();
	};

	return {
		log: log,
		show: show,
		hide: hide
	};
}


// dit moet eigenlijk in de main.js om het proper te houden, maar ik wou geen mergeconflicts :-)
window.konsole;
$(function () {
	window.konsole = new Konsole({el:'.konsole', limit: 10, hidden: true});
})
