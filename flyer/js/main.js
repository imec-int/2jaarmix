$(document).click(function(event){

	event.preventDefault();
	console.log("wadde");
	playSound(bufferList[0],0);
	interval = setInterval("sequenceTick();", 400);
	hasStarted = true;
	$(document).unbind("click");

	return false;
});


$(".sequence-left-group > .sequence").click(function(event){
	event.preventDefault();
	$(this).toggleClass("sequence-left");
	$(this).toggleClass("sequence-left-off");
	updateLeftArray();
	return false;
});

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

$(".sequence-right-group > .sequence").click(function(event){
	event.preventDefault();
	$(this).toggleClass("sequence-right");
	$(this).toggleClass("sequence-right-off");
	updateRightArray();
	return false;
});


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



