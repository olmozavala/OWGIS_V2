goog.provide('owgis.ncwms.currents.style')

goog.require('owgis.ncwms.currents.particles')

var minNumParticles = 100;
var maxNumParticles = 40000;
var maxParticleLifeTime = 300;
var minParticleLifeTime = 10;


var speedIncrement = 1;
function particleSpeedToSlider(speed){
	var sliderSpeed = speed*speedIncrement;
//	console.log("Speed to slider ----- Speed: "+speed+ " slider:"+sliderSpeed);
	return sliderSpeed;
}

function sliderToParticleSpeed(value){
	var speed = value/speedIncrement;
//	console.log("Slider to speed ------ Speed : "+speed + " slider:"+value);
	return speed;
}


owgis.ncwms.currents.style.togglestyling = function toggleWindow(){
	$("#currentsControlsContainer").toggle();
}

owgis.ncwms.currents.style.reset = function reset(){

	if(!mobile){
		$("#numParticlesSlider").slider("option","value",
		owgis.ncwms.currents.particles.getDefaultNumParticles() );

		$("#particleSpeedSlider").slider("option","value",
		particleSpeedToSlider(owgis.ncwms.currents.particles.getCurrentResolutionParticleSpeed()) );
		
		$("#particleLifeTimeSlider").slider("option","value",
		owgis.ncwms.currents.particles.getDefaultParticlesLifeTime());
		
	}else{
		$("#numParticlesSlider")
				.prop("value", owgis.ncwms.currents.particles.getDefaultNumParticles() ); 
		$("#numParticlesSlider").slider('refresh');
		owgis.ncwms.currents.particles.setNumParticles(
			owgis.ncwms.currents.particles.getDefaultNumParticles() ); 

		$("#particleSpeedSlider")
				.prop("value", particleSpeedToSlider(owgis.ncwms.currents.particles.getCurrentResolutionParticleSpeed() )); 

		$("#particleSpeedSlider").slider('refresh');

		$("#particleLifeTimeSlider")
				.prop("value", owgis.ncwms.currents.particles.getDefaultParticlesLifeTime());
		$("#particleLifeTimeSlider").slider('refresh');
		owgis.ncwms.currents.particles.setParticlesLifeTime(
			owgis.ncwms.currents.particles.getDefaultParticlesLifeTime() ); 
	}
        //set background color, spectrum do not work
	var spp = document.getElementsByClassName("sp-preview-inner");
	spp[0].style.backgroundColor = owgis.ncwms.currents.getDefColor();
        owgis.ncwms.currents.setColor(owgis.ncwms.currents.getDefColor());
}

owgis.ncwms.currents.style.init = function init(){
	initPicker();
	initNumParticlesSlider();
	initParticlesSpeedSlider();
	initParticlesLifeTimeSlider();
}

/**
 * Depending on the resolution been received  it modifies the speed of the 
 * particles with an exponential function. 
 * @param {type} resolution
 * @param {type} extent
 * @returns {undefined}
 */
owgis.ncwms.currents.style.updateParticleSpeedFromResolution = function updateParticleSpeedFromResolution(resolution, extent){
	
//	console.log("Resolution non Cesium: "+resolution);
	var newParticleSpeed = (Math.pow(resolution,1.01)) * owgis.ncwms.currents.particles.getDefaultParticleSpeed();
	//This indicates at what percentage from 0 to 100 the default
	// value will be in the slider
	speedIncrement = 30/newParticleSpeed;
	
	if(mobile){
		owgis.ncwms.currents.particles.setParticleSpeed(newParticleSpeed);
	}
	
	owgis.ncwms.currents.particles.setCurrentResolutionParticleSpeed(newParticleSpeed);
	//	console.log("Speed increment: "+speedIncrement);
	
	newParticleSpeed = particleSpeedToSlider(newParticleSpeed);
	if(!mobile){
		$("#particleSpeedSlider").slider("option","value",newParticleSpeed);
	}else{
		$("#particleSpeedSlider").prop("value",newParticleSpeed);
		$("#particleSpeedSlider").slider('refresh');
	}
}

/**
 * This function is used to update the sliders with a new value of number of
 * particles 
 * @param {type} numParticles
 * @returns {undefined}
 */
owgis.ncwms.currents.style.updateNumberOfParticlesSliders = function(numParticles){
	console.log("Update num of particles slider: "+numParticles);
	if(!mobile){
		$("#numParticlesSlider").slider("option","value",numParticles);
	}else{
		$("#numParticlesSlider").prop("value",numParticles);
		$("#numParticlesSlider").slider('refresh');
	}
}

function initPicker(){
	$('#currentsColor').spectrum( {
		color: owgis.ncwms.currents.getColor(),
		alpha:.5,
		chooseText:"Close",
		cancelText:"",
		showAlpha:true,
		containerClassName:"colorPickerContainer",
		move: setColor
	});
}

function initParticlesLifeTimeSlider(){
	if(!mobile){
		$("#particleLifeTimeSlider").slider({
			max:maxParticleLifeTime,
			min:minParticleLifeTime,
			value:owgis.ncwms.currents.particles.getParticlesLifeTime(),
			change: setParticlesTimeSpeed
		});
	}else{
		$("#particleLifeTimeSlider")
				.addClass("ui-hidden-accessible")
				.prop("max",maxParticleLifeTime)
				.prop("min",minParticleLifeTime)
				.prop("value", owgis.ncwms.currents.particles.getParticlesLifeTime());
		
		$("#particleLifeTimeSlider").slider('refresh');
		$("#particleLifeTimeSlider").on('change', setParticlesTimeSpeedMobile);
	}
}

function initParticlesSpeedSlider(){
	var minParticleSpeed = 1;
	var maxParticleSpeed = 100;
	
	if(!mobile){
		$("#particleSpeedSlider").slider({
			max:maxParticleSpeed,
			min:minParticleSpeed,
			value: particleSpeedToSlider(owgis.ncwms.currents.particles.getParticleSpeed()),
			change: setParticlesSpeed
		});
	}else{
		$("#particleSpeedSlider")
				.addClass("ui-hidden-accessible")
				.prop("min",minParticleSpeed)
				.prop("max",maxParticleSpeed)
				.prop("value",particleSpeedToSlider(owgis.ncwms.currents.particles.getParticleSpeed()));
		
		
		$("#particleSpeedSlider").slider('refresh');
		$("#particleSpeedSlider").on('change', setParticlesSpeedMobile);
	}
}

function initNumParticlesSlider(){
	if(!mobile){
		$("#numParticlesSlider").slider({
			max:maxNumParticles,
			min:minNumParticles,
			value:owgis.ncwms.currents.particles.getNumParticles(),
			change: setNumParticles
		});
		$("#numParticles").text( owgis.ncwms.currents.particles.getNumParticles());
	}else{
		$("#numParticlesSlider")
				.prop("min",minNumParticles/2)
				.prop("max",maxNumParticles)
				.prop("value",owgis.ncwms.currents.particles.getNumParticles());
		
		$("#numParticlesSlider").slider('refresh');
		$("#numParticlesSlider").on('change', setNumParticlesMobile);
	}
}

/**
 * This function updates the particles speed from the slider, for desktop version.
 * @param {type} event
 * @param {type} ui
 * @returns {undefined}
 */
function setParticlesSpeed(event, ui){
	owgis.ncwms.currents.particles.setParticleSpeed(sliderToParticleSpeed(ui.value));
}
/**
 * This function updates the particles speed from the slider, for mobile version
 * @param {type} event
 * @param {type} ui
 * @returns {undefined}
 */
function setParticlesSpeedMobile(event){
	var value = event.currentTarget.value;
	owgis.ncwms.currents.particles.setParticleSpeed(sliderToParticleSpeed(value));
}

function setParticlesTimeSpeed(event, ui){
	owgis.ncwms.currents.particles.setParticlesLifeTime(ui.value);
}

function setParticlesTimeSpeedMobile(event){
	var value = event.currentTarget.value;
	owgis.ncwms.currents.particles.setParticlesLifeTime(value);
}

function setNumParticles(event, ui){
	$("#numParticles").text( ui.value );
	owgis.ncwms.currents.particles.setNumParticles(ui.value);
}

function setNumParticlesMobile(event){
	var value = event.currentTarget.value;
	owgis.ncwms.currents.particles.setNumParticles(value);
}

function setColor(color){
	owgis.ncwms.currents.setColor(color.toRgbString());
}