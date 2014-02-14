function setClickHandlers () {


	$(".sequence-left-group > .sequence").click(function(event){
		event.preventDefault();
		$(this).toggleClass("sequence-left");
		$(this).toggleClass("sequence-left-off");
		updateLeftArray();

		if(!hasStarted){
			$(".title > h2").text(titleArray[currentSequence]);
			$(".title").css("background-image", "url(/img/gear.png)");
			playSound(bufferList[0],0);
			interval = setInterval("sequenceTick();", 400);
			hasStarted = true;
		}

		return false;
	});

	$(".sequence-right-group > .sequence").click(function(event){
		event.preventDefault();
		$(this).toggleClass("sequence-right");
		$(this).toggleClass("sequence-right-off");
		updateRightArray();

		if(!hasStarted){
			$(".title > h2").text(titleArray[currentSequence]);
			$(".title").css("background-image", "url(/img/gear.png)");
			playSound(bufferList[0],0);
			interval = setInterval("sequenceTick();", 400);
			hasStarted = true;
		}

		return false;
	});

	$(".title").click(function(event){
		event.preventDefault();
		$(".title").hide();
		$(".body").css("-webkit-filter", "hue-rotate(50deg)");

		return false;
	});

}

function updateLeftArray(){
	$(".sequence-left-group > .sequence").each(function(i,el){
		leftArray[i] = $(el).hasClass("sequence-left");
	})
}
function updateRightArray(){
	$(".sequence-right-group > .sequence").each(function(i,el){
		rightArray[i] = $(el).hasClass("sequence-right");
	})
}
var colors = ["#8DBDC7","#FFE37F","#F0C271","#E3A368","#D18461"];
var titleArray = ["HACK","THIS","PRESS","HERE"];
var hasStarted = false;
var interval = 0;
var currentSequence = 0;
var context;
var bufferLoader;
var leftArray = [false,false,false,false];
var rightArray = [false,false,false,false];
var startTime;
var tempo = 80; // BPM (beats per minute)
var eighthNoteTime = (60 / tempo) / 2;
var bufferList;

window.onload = init;

function init(){
	//start timer
	// interval = setInterval("sequenceTick();", 200);

	//init sound
	initSound();

	setClickHandlers();

	//fastclick for mobile devices:
	FastClick.attach(document.body);
}

function sequenceTick(){
	if(currentSequence==3){
		currentSequence = 0;
	}else{
		currentSequence ++;
	}
	var top = parseInt($("#flow-sequencer").css("top"), 10);
	// console.log("sequenceTick - "+ top);
	$("#flow-sequencer").css("top",currentSequence*70);

	$("body").css("background-color",colors[currentSequence]);
	$(".title > h2").text(titleArray[currentSequence]);


	if(leftArray[currentSequence])
		playSound(bufferList[0],0);
	if(rightArray[currentSequence])
		playSound(bufferList[1],0);

	// console.log(leftArray);
}

function initSound() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      '/sounds/snare.wav',
      '/sounds/kick.wav',
    ],
    finishedLoading
    );

  bufferLoader.load();
  startTime = context.currentTime + 0.100;
}

function finishedLoading(_bufferList) {
	bufferList = _bufferList;


}

// var kick = BUFFERS.kick;
// var snare = BUFFERS.snare;
// var hihat = BUFFERS.hihat;

function playSound(buffer, time) {
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	if (!source.start)
	  source.start = source.noteOn;
	source.start(time);
}



