// var colors = ["#8DBDC7","#FFE37F","#F0C271","#E3A368","#D18461"];
var colors = ["#0A87BF","#03657F","#00F2FF","#011940","#0781E5", "#BF09A1","#13207F","#E098FF","#120040","#A841E5"];
var titleArray1 = ["HACK","THIS","MUSIC","NOW!"];
var titleArray2 = ["MEDIA HACKATHON","Zat. 15/03","AB BRUSSEL","-> Inschrijven! <-"];
var hasStarted = false;
var interval = 0;
var currentSequence = 0;
var context;
var leftArray = [false,false,false,false];
var middleArray = [false,false,false,false];
var rightArray = [false,false,false,false];
var startTime = 0;
var bufferList;
var backPLaying = false;
var gainNodeSequence;
var preloadedSounds;
var flyerstarted = false;

function init(){
	if(isFirefox()){
		preloadedSounds = [
			'/sounds/original/Snare.ogg',
			'/sounds/original/Hihat.ogg',
			'/sounds/original/Kick.ogg',
			'/sounds/original/Bassline.ogg',
			'/sounds/original/sequencer2.ogg',
		]
	}else{
		preloadedSounds = [
			'/sounds/original/Snare.mp3',
			'/sounds/original/Hihat.mp3',
			'/sounds/original/Kick.mp3',
			'/sounds/original/Bassline.wav',
			'/sounds/original/sequencer2.wav',
		]
	}


	$("#flow-sequencer").css("height",$(".sequence-left-group > .sequence").height() + 30);

	initClickHandlers();

	//fastclick for mobile devices:
	FastClick.attach(document.body);
}

function isFirefox(){
	return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

function startFlyer () {
	if(flyerstarted) return;
	try{
		initSound();
		initMotionsound();
		flyerstarted = true;
	}catch(err){
		handleError();
	}
}

function handleError () {
	$("#loadingmusic").html('<a href="http://mediahackathon.eventbrite.com", target="_parent">AudioContext not supported. Try a real browser:p. But please, register anyway ;-)</a>');
	$("#loadingmusic").height(26*2);
	$("#loadingbar").hide();
}

function initClickHandlers () {

	$(".sequence-group > .sequence").click(function (event){
		event.preventDefault();
		if($(this).hasClass("sequence-left")||$(this).hasClass("sequence-left-off")){
			//left
			$(this).toggleClass("sequence-left");
			$(this).toggleClass("sequence-left-off");
		}else if($(this).hasClass("sequence-middle")||$(this).hasClass("sequence-middle-off")){
			//MIDDLE
			$(this).toggleClass("sequence-middle");
			$(this).toggleClass("sequence-middle-off");
		}else if($(this).hasClass("sequence-right")||$(this).hasClass("sequence-right-off")){
			//RIGHT
			$(this).toggleClass("sequence-right");
			$(this).toggleClass("sequence-right-off");
		}
		updateSequenceArrays();

		// CHECK for start
		if(!hasStarted){
			// $(".title > h2").text(titleArray[currentSequence]);
			$(".title").css("background-image", "url(/img/gear.png)");
			playSound(bufferList[0],0);
			$(".title-container > span").css("font-size","10vw");
			$(".title-container > span").text(titleArray2[0]);
			// interval = setInterval("sequenceTick();", 400);
			hasStarted = true;
		}

		return false;
	});

	$(".title").click(function (event){
		event.preventDefault();
		$(".title").hide();

		return false;
	});


	$("#buttonShowFlyer").click(function (event) {
		$('.flip-container').addClass('turnaround');
		startFlyer();
	});

	$("#buttonShowProgramme").click(function (event) {
		$('.flip-container').removeClass('turnaround');
	});


	$(window).on("load resize orientationchange", function() {
		$('.agenda-content').height( $('.agenda-background').height() );

		$('.flyer-content').height( $('.flyer-background').height() );
		$('.flyer-background-colorpane').height( $('.flyer-background').height() );
	});


}

function updateSequenceArrays(){
	$(".sequence-left-group > .sequence").each(function(i,el){
		leftArray[i] = $(el).hasClass("sequence-left");
	});
	$(".sequence-middle-group > .sequence").each(function(i,el){
		middleArray[i] = $(el).hasClass("sequence-middle");
	});
	$(".sequence-right-group > .sequence").each(function(i,el){
		rightArray[i] = $(el).hasClass("sequence-right");
	});
}
function updateMiddleArray(){
	$(".sequence-middle-group > .sequence").each(function(i,el){
		middleArray[i] = $(el).hasClass("sequence-middle");
	})
}
function updateRightArray(){
	$(".sequence-right-group > .sequence").each(function(i,el){
		rightArray[i] = $(el).hasClass("sequence-right");
	})
}

function sequenceTick(){
	if(currentSequence==3){
		currentSequence = 0;
		$("#flow-sequencer").css("height",$(".sequence-left-group > .sequence").height()  +30);
		if(hasStarted){
			if(!backPLaying){
				initBackSoundBassline();
				initBackSoundSequence();
				backPLaying = true;
			}
		}


	}else{
		currentSequence ++;
	}
	var backgroundcolor = "rgb("+(Math.floor(Math.random()*128))+","+(Math.floor(Math.random()*64))+","+(Math.floor(Math.random()*128)+128)+")";

	$("body").css("background-color", backgroundcolor);
	$(".flyer-background-colorpane").css("background-color", backgroundcolor);


	var top = parseInt($("#flow-sequencer").css("top"), 10);
	// console.log("rgb("+(Math.floor(Math.random()*128))+","+(Math.floor(Math.random()*64))+","+(Math.floor(Math.random()*255))+")");
	$("#flow-sequencer").css("top",currentSequence*$("#flow-sequencer").height() +5);
	// $("body").css("background-color",colors[Math.floor(Math.random()*colors.length)]);

	if(!hasStarted){
		$(".title-container > a").text(titleArray1[currentSequence]);
	}else{
		$(".title-container > a").text(titleArray2[currentSequence]);
	}

	if(leftArray[(currentSequence + 1) % 4])
		playSound(bufferList[0],startTime);
	if(middleArray[currentSequence])
		playSound(bufferList[1],startTime);
	if(rightArray[currentSequence])
		playSound(bufferList[2],startTime);
}

function initSound() {
	// Fix up prefixing
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();



	var bufferLoader = new BufferLoader(
		context,
		preloadedSounds,
		finishedLoading,
		loadingProgress,
		handleError
		);

	bufferLoader.load();
	startTime = context.currentTime + 0.0100;
}

function finishedLoading(_bufferList) {
	bufferList = _bufferList;

	$('#loadingmusic').addClass('hidden');

	interval = setInterval(sequenceTick, 458);
}

function loadingProgress (percentage) {
	$("#loadingmusic > .bar").width(percentage*100 + '%');
}

function initBackSoundBassline(){
	var source = context.createBufferSource();
	source.buffer = bufferList[3];
	source.loop = true;
	source.connect(context.destination);
	if (!source.start)
	  source.start = source.noteOn;
	source.start(startTime);
}

function initBackSoundSequence(){
	var source = context.createBufferSource();
	source.buffer = bufferList[4];
	source.loop = true;
	gainNodeSequence = context.createGain();
	source.connect(gainNodeSequence);
	gainNodeSequence.connect(context.destination);
	if (!source.start)
	  source.start = source.noteOn;
	source.start(startTime);
}

function playSound(buffer, time) {
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	if (!source.start)
	  source.start = source.noteOn;
	source.start(time);
}

function initMotionsound () {
	var motionsound = new Motionsound({
		onLeftVolumeChanged: leftVolumeChanged,
		onRightVolumeChanged: rightVolumeChanged
	});
	motionsound.init();
}

function leftVolumeChanged(value){
	// value is een waarde tussen 0 en 1
	// konsole.log( 'left volume: ' + Math.round(value*100)/100 );

	if(gainNodeSequence){
		gainNodeSequence.gain.value = value;
	}
}

function rightVolumeChanged(value){
	// value is een waarde tussen 0 en 1
	// konsole.log( 'right volume: ' + Math.round(value*100)/100 );

	if(gainNodeSequence){
		gainNodeSequence.gain.value = value;
	}
}

$(function () {
	init();
});

